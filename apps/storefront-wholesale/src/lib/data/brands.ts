import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { HttpTypes } from "@medusajs/types"

export interface StoreBrand {
  id: string
  name: string
  description?: string
  handle: string
  thumbnail?: string
  metadata?: Record<string, any>
  created_at?: string
  updated_at?: string
}

export interface BrandsResponse {
  brands: StoreBrand[]
  count: number
  limit: number
  offset: number
}

export interface BrandResponse {
  brand: StoreBrand
}

export interface BrandProductsResponse {
  products: HttpTypes.StoreProduct[]
  hasMore: boolean
  count: number
  limit: number
  offset: number
}

export const listBrands = async (query?: {
  limit?: number
  offset?: number
  q?: string
  handle?: string
}): Promise<StoreBrand[]> => {
  try {
    const next = {
      ...(await getCacheOptions("brands")),
    }

    const headers = {
      ...(await getAuthHeaders()),
    }

    const response = await sdk.client.fetch<BrandsResponse>("/store/brands", {
      query: {
        fields:
          "id,name,description,handle,thumbnail,metadata,created_at,updated_at",
        limit: query?.limit || 100,
        offset: query?.offset || 0,
        ...(query?.q && { q: query.q }),
        ...(query?.handle && { handle: query.handle }),
      },
      next: {
        tags: ["brands", ...(next.tags || [])], // Add both generic and user-specific cache tags
      },
      cache: "force-cache",
      headers,
    })

    return response.brands || []
  } catch (error) {
    console.error("Failed to fetch brands:", error)
    return []
  }
}

export const getBrandByHandle = async (
  handle: string
): Promise<StoreBrand | null> => {
  try {
    const next = {
      ...(await getCacheOptions("brands")),
    }

    const headers = {
      ...(await getAuthHeaders()),
    }

    const response = await sdk.client.fetch<BrandResponse>(
      `/store/brands/${handle}`,
      {
        query: {
          fields:
            "id,name,description,handle,thumbnail,metadata,created_at,updated_at",
        },
        next: {
          tags: ["brands", `brand-handle-${handle}`, ...(next.tags || [])], // Add both generic and user-specific cache tags
        },
        cache: "force-cache",
        headers,
      }
    )

    return response.brand || null
  } catch (error) {
    console.error("Failed to fetch brand by handle:", error)
    return null
  }
}

export const getBrandProducts = async (
  handle: string,
  query?: {
    limit?: number
    offset?: number
  }
): Promise<{
  products: HttpTypes.StoreProduct[]
  hasMore: boolean
  total: number
}> => {
  try {
    const next = {
      ...(await getCacheOptions("products")),
    }

    const headers = {
      ...(await getAuthHeaders()),
    }

    const limit = query?.limit || 20
    const offset = query?.offset || 0

    const response = await sdk.client.fetch<BrandProductsResponse>(
      `/store/brands/${handle}/products`,
      {
        query: {
          fields:
            "id,title,description,handle,status,thumbnail,*variants,*images,*brand,*categories",
          limit,
          offset,
        },
        next: {
          ...next,
          revalidate: 600, // Revalidate brand products every 10 minutes for inventory updates
        },
        cache: "force-cache",
        headers,
      }
    )

    const products = response.products || []
    const hasMore = response.hasMore ?? false

    return {
      products,
      hasMore,
      total: products.length,
    }
  } catch (error) {
    console.error("Failed to fetch brand products:", error)
    return {
      products: [],
      hasMore: false,
      total: 0,
    }
  }
}
