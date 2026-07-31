"use server"

import { sdk } from "@lib/config"
import { getDomainForwardHeaders } from "@lib/domain-headers"
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import {
  getAuthHeaders,
  getCacheOptions,
  getProductCacheTag,
  getProductHandleCacheTag,
} from "./cookies"
import { getRegion, retrieveRegion } from "./regions"

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  countryCode?: string
  regionId?: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
    ...(await getDomainForwardHeaders()),
  }

  const next = {
    ...(await getCacheOptions("products")),
  }

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
      `/store/products`,
      {
        method: "GET",
        query: {
          limit,
          offset,
          region_id: region?.id,
          fields:
            "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags,+brand.*",
          ...queryParams,
        },
        headers,
        next: {
          ...next,
          revalidate: 300, // Revalidate product listings every 5 minutes for inventory updates
        },
        cache: "force-cache",
      }
    )
    .then(({ products, count }) => {
      // Use products length vs limit to determine hasMore (similar to brands fix)
      const hasMore = products.length === limit
      const nextPage = hasMore ? pageParam + 1 : null

      return {
        response: {
          products,
          count, // Keep for backward compatibility but unreliable
        },
        nextPage: nextPage,
        queryParams,
      }
    })
}

/**
 * This will fetch 100 products to the Next.js cache and sort them based on the sortBy parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
export const getProductByHandle = async (
  handle: string,
  countryCode: string
): Promise<HttpTypes.StoreProduct | null> => {
  try {
    if (!countryCode) {
      throw new Error("Country code is required")
    }

    let region: HttpTypes.StoreRegion | undefined | null

    if (countryCode) {
      region = await getRegion(countryCode)
    }

    if (!region) {
      return null
    }

    const headers = {
      ...(await getAuthHeaders()),
      ...(await getDomainForwardHeaders()),
    }

    const cacheConfig = "force-cache"

    // Add handle-based cache tag since we don't know the product ID until after fetch
    const nextWithHandleTag = {
      ...(await getCacheOptions("products", [
        getProductHandleCacheTag(handle),
      ])),
    }

    // Get product by handle with handle-specific cache tag
    const response = await sdk.client
      .fetch<{
        products: HttpTypes.StoreProduct[]
        count: number
      }>(`/store/products`, {
        method: "GET",
        query: {
          handle,
          limit: 100, // Get enough products to find the one we want
          region_id: region?.id,
          fields:
            "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags,+brand.*,+seller.*",
        },
        headers,
        next: {
          ...nextWithHandleTag,
          revalidate: 180, // Revalidate individual products every 3 minutes for accurate inventory and pricing
        },
        cache: cacheConfig,
      })
      .then(({ products }) => products[0])

    return response || null
  } catch (error) {
    console.error("Failed to fetch product by handle:", error)
    return null
  }
}

/**
 * Get a product by its ID
 */
export const getProductById = async (
  productId: string,
  countryCode: string
): Promise<HttpTypes.StoreProduct | null> => {
  try {
    if (!countryCode) {
      throw new Error("Country code is required")
    }

    let region: HttpTypes.StoreRegion | undefined | null

    if (countryCode) {
      region = await getRegion(countryCode)
    }

    if (!region) {
      return null
    }

    const headers = {
      ...(await getAuthHeaders()),
      ...(await getDomainForwardHeaders()),
    }

    const next = {
      ...(await getCacheOptions("products", [getProductCacheTag(productId)])),
    }

    const cacheConfig = "force-cache"

    // Get product by ID
    const response = await sdk.client.fetch<{
      product: HttpTypes.StoreProduct
    }>(`/store/products/${productId}`, {
      method: "GET",
      query: {
        id: productId,
        region_id: region?.id,
        fields:
          "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags,+brand.*,+seller.*",
      },
      headers,
      next: {
        ...next,
        revalidate: 180, // Revalidate individual products every 3 minutes for accurate inventory and pricing
      },
      cache: cacheConfig,
    })

    return response.product || null
  } catch (error) {
    console.error("Failed to fetch product by ID:", error)
    return null
  }
}

export const listProductsWithSort = async ({
  page = 1,
  queryParams,
  sortBy = "created_at",
  countryCode,
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  sortBy?: SortOptions
  countryCode: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  const limit = queryParams?.limit || 15

  // Check if we can use server-side sorting for this sort option
  const serverSideSortMap: Record<string, string> = {
    created_at: "-created_at", // Newest first (descending)
    title_asc: "title", // Alphabetical A-Z
    title_desc: "-title", // Alphabetical Z-A
  }

  const serverSideOrderParam = serverSideSortMap[sortBy]

  if (serverSideOrderParam) {
    // Use server-side sorting for supported fields - much more efficient!
    // Note: listProducts uses 1-based pageParam, which works correctly with infinite scroll
    return await listProducts({
      pageParam: page,
      queryParams: {
        ...queryParams,
        order: serverSideOrderParam,
        limit,
      },
      countryCode,
    })
  } else {
    // For price-based sorting, we need client-side processing since MedusaJS
    // doesn't support sorting by calculated variant prices out of the box

    // Calculate how many products we need to fetch to get accurate pagination
    // We'll fetch a reasonable chunk size and handle pagination properly
    const chunkSize = Math.max(limit * 5, 60) // Fetch 5 pages worth or minimum 60 products

    const {
      response: { products: allProducts, count },
    } = await listProducts({
      pageParam: 1,
      queryParams: {
        ...queryParams,
        limit: chunkSize,
        order: "-created_at", // Default ordering for consistent results
      },
      countryCode,
    })

    // Sort the fetched products
    const sortedProducts = sortProducts(allProducts, sortBy)

    // Calculate pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = sortedProducts.slice(startIndex, endIndex)

    // Use more reliable hasMore logic
    // If we have fewer products than requested chunk size, we've reached the end
    const hasMoreData = allProducts.length === chunkSize
    const hasMorePages = paginatedProducts.length === limit && hasMoreData

    const nextPage = hasMorePages ? page + 1 : null

    return {
      response: {
        products: paginatedProducts,
        count: count, // Always use the total count from backend, don't adjust for partial data
      },
      nextPage,
      queryParams,
    }
  }
}
