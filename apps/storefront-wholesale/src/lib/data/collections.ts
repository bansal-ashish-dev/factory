"use server"

import { sdk } from "@lib/config"
import { getDomainForwardHeaders } from "@lib/domain-headers"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

export const retrieveCollection = async (id: string) => {
  try {
    const next = {
      ...(await getCacheOptions("collections")),
    }

    const headers = {
      ...(await getDomainForwardHeaders()),
    }

    return sdk.client
      .fetch<{ collection: HttpTypes.StoreCollection }>(
        `/store/collections/${id}`,
        {
          headers,
          next: {
            ...next,
            revalidate: 3600, // Revalidate collections every hour since they change less frequently
          },
          cache: "force-cache",
        }
      )
      .then(({ collection }) => collection)
  } catch (error) {
    console.error("Failed to retrieve collection:", error)
    // Return null during build failures to prevent build from crashing
    return null
  }
}

export const listCollections = async (
  queryParams: Record<string, string> = {}
): Promise<{ collections: HttpTypes.StoreCollection[]; count: number }> => {
  try {
    const next = {
      ...(await getCacheOptions("collections")),
    }

    const headers = {
      ...(await getDomainForwardHeaders()),
    }

    queryParams.limit = queryParams.limit || "100"
    queryParams.offset = queryParams.offset || "0"

    return sdk.client
      .fetch<{ collections: HttpTypes.StoreCollection[]; count: number }>(
        "/store/collections",
        {
          query: queryParams,
          headers,
          next: {
            ...next,
            revalidate: 3600, // Revalidate collections list every hour
          },
          cache: "force-cache",
        }
      )
      .then(({ collections }) => ({ collections, count: collections.length }))
  } catch (error) {
    console.error("Failed to fetch collections:", error)
    // Only return empty array during static generation (build time)
    if (
      process.env.NODE_ENV === "production" &&
      typeof window === "undefined"
    ) {
      return { collections: [], count: 0 }
    }
    // In development, re-throw the error so we can see what's wrong
    throw error
  }
}

export const getCollectionByHandle = async (
  handle: string
): Promise<HttpTypes.StoreCollection | null> => {
  try {
    const next = {
      ...(await getCacheOptions("collections")),
    }

    const headers = {
      ...(await getDomainForwardHeaders()),
    }

    return sdk.client
      .fetch<HttpTypes.StoreCollectionListResponse>(`/store/collections`, {
        query: { handle, fields: "*products" },
        headers,
        next: {
          ...next,
          revalidate: 1800, // Revalidate individual collections every 30 minutes to reflect product changes
        },
        cache: "force-cache",
      })
      .then(({ collections }) => collections[0])
  } catch (error) {
    console.error("Failed to fetch collection by handle:", error)
    // Return null during build failures to prevent build from crashing
    return null
  }
}
