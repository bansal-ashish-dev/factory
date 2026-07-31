import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getDomainForwardHeaders } from "@lib/domain-headers"
import { HttpTypes } from "@medusajs/types"

export interface StoreSeller {
  id: string
  name: string
  handle?: string
  description?: string
  photo?: string
  store_status: string
  address_line?: string
  city?: string
  postal_code?: string
  country_code?: string
  type: string
  email?: string
  phone?: string
  company_name?: string
  logo?: string
  state?: string
  created_at?: string
  updated_at?: string
  metadata?: Record<string, any>
}

export interface SellersResponse {
  sellers: StoreSeller[]
  count: number
  limit: number
  offset: number
}

export const listSellers = async (query?: Record<string, any>) => {
  try {
    const next = {
      ...(await getCacheOptions("sellers")),
    }

    const headers = {
      ...(await getAuthHeaders()),
      ...(await getDomainForwardHeaders()),
    }

    const limit = query?.limit || 100
    const cacheConfig = "force-cache"

    return sdk.client
      .fetch<{ sellers: StoreSeller[] }>("/store/seller", {
        query: {
          fields:
            "id,name,handle,description,photo,store_status,address_line,city,postal_code,country_code,type,created_at,updated_at",
          limit,
          ...query,
        },
        next: {
          ...next,
          revalidate: 1800, // Revalidate sellers every 30 minutes since seller info changes less frequently
        },
        cache: cacheConfig,
        headers,
      })
      .then(({ sellers }) => sellers)
  } catch (error) {
    console.error("Failed to fetch sellers:", error)
    // Return empty array on error to prevent build failures
    return []
  }
}

export const getSellerByHandle = async (handle: string) => {
  try {
    const next = {
      ...(await getCacheOptions("sellers")),
    }

    const headers = {
      ...(await getAuthHeaders()),
      ...(await getDomainForwardHeaders()),
    }

    const cacheConfig = "force-cache"

    // Use the individual seller endpoint
    return sdk.client
      .fetch<{ seller: StoreSeller }>(`/store/seller/${handle}`, {
        query: {
          fields:
            "id,name,handle,description,photo,store_status,address_line,city,postal_code,country_code,type,created_at,updated_at",
        },
        next: {
          ...next,
          revalidate: 1800, // Revalidate individual sellers every 30 minutes
        },
        cache: cacheConfig,
        headers,
      })
      .then(({ seller }) => seller)
  } catch (error) {
    console.error(`Failed to fetch seller with handle ${handle}:`, error)
    return null
  }
}

export const getSellerProducts = async (
  sellerId: string,
  region: { id: string },
  query?: Record<string, any>
): Promise<{
  products: HttpTypes.StoreProduct[]
  hasMore: boolean
  total: number
}> => {
  try {
    const next = {
      ...(await getCacheOptions("seller_products")),
    }

    const headers = {
      ...(await getAuthHeaders()),
      ...(await getDomainForwardHeaders()),
    }

    const cacheConfig = "force-cache"
    const limit = query?.limit || 20
    const offset = query?.offset || 0

    const response = await sdk.client.fetch<{
      products: HttpTypes.StoreProduct[]
      count: number
      offset: number
      limit: number
    }>(`/store/seller/${sellerId}/products`, {
      query: {
        fields:
          "id,title,description,handle,status,thumbnail,*variants,*images,*seller,*categories,metadata,seller.*",
        limit,
        offset,
        ...query,
      },
      next: {
        ...next,
        revalidate: 600, // Revalidate seller products every 10 minutes for inventory updates
      },
      cache: cacheConfig,
      headers,
    })

    const products = response.products || []
    const totalCount = response.count || 0
    // Use proper pagination logic based on total count
    const hasMore = (response.offset || 0) + products.length < totalCount

    return {
      products,
      hasMore,
      total: totalCount,
    }
  } catch (error) {
    console.error("Failed to fetch seller products:", error)
    return {
      products: [],
      hasMore: false,
      total: 0,
    }
  }
}
