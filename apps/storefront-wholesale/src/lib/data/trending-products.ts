"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion } from "./regions"

export type TrendingProducts = {
  top_selling: HttpTypes.StoreProduct[]
  new_products: HttpTypes.StoreProduct[]
  _debug?: {
    domain_context?: any
    seller_filter?: string
    filters_applied?: any
  }
}

export const getTrendingProducts = async ({
  countryCode,
  limit = 8,
}: {
  countryCode: string
  limit?: number
}): Promise<TrendingProducts> => {
  const region = await getRegion(countryCode)

  if (!region) {
    return {
      top_selling: [],
      new_products: [],
    }
  }

  const authHeaders = await getAuthHeaders()

  const requestHeaders = {
    ...authHeaders,
  }

  const next = {
    ...(await getCacheOptions("trending-products", [`region-${region.id}`])),
  }

  try {
    const data = await sdk.client.fetch<TrendingProducts>(
      `/store/products/trending`,
      {
        method: "GET",
        query: {
          limit,
          region_id: region.id,
        },
        headers: requestHeaders,
        next: {
          ...next,
          revalidate: 900, // Revalidate trending products every 15 minutes to keep them fresh
        },
        cache: "force-cache",
      }
    )

    return data
  } catch (error) {
    console.error("Failed to fetch trending products:", error)
    return {
      top_selling: [],
      new_products: [],
    }
  }
}
