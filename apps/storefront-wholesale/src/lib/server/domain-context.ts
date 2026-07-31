import { cache } from "react"
import { headers } from "next/headers"
import { unstable_cache } from "next/cache"

interface DomainContext {
  host: string
  context: {
    type: "main" | "subdomain" | "custom"
    seller_id?: string
  }
  seller?: {
    id: string
    name: string
    photo?: string
  } | null
}

interface FetchOptions {
  revalidate?: number | false
  tags?: string[]
}

// Base fetch function (not cached)
async function fetchDomainContextRaw(
  host: string
): Promise<DomainContext | null> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

    const response = await fetch(`${baseUrl}/store/domain/context`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-original-host": host,
        "x-client-host": host,
        "x-publishable-api-key":
          process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
      },
      // Use Next.js caching with revalidation
      next: {
        revalidate: 300, // Cache for 5 minutes
        tags: [`domain-context-${host}`],
      },
    })

    if (!response.ok) {
      console.error(`Domain context fetch failed: ${response.status}`)
      return null
    }

    const data = await response.json()
    return data as DomainContext
  } catch (error) {
    console.error("Failed to fetch domain context:", error)
    return null
  }
}

// Cache the domain context fetch with React's cache function for request deduplication
const fetchDomainContextCached = cache(fetchDomainContextRaw)

// Additional Next.js unstable_cache for cross-request caching
const getDomainContextUnstableCached = unstable_cache(
  async (host: string) => fetchDomainContextRaw(host),
  ["domain-context"],
  {
    revalidate: 300, // 5 minutes
    tags: ["domain-context"],
  }
)

// Server function to fetch domain context with caching
export async function getDomainContext(
  options: FetchOptions = {}
): Promise<DomainContext | null> {
  try {
    const headersList = await headers()
    const host = headersList.get("host") || ""

    if (!host) {
      console.warn("No host header found")
      return null
    }

    // Use unstable_cache for better cross-request caching
    const domainContext = await getDomainContextUnstableCached(host)

    return domainContext
  } catch (error) {
    console.error("Error in getDomainContext:", error)
    return null
  }
}

// Function to revalidate domain context cache
export async function revalidateDomainContext(host?: string) {
  try {
    const headersList = await headers()
    const currentHost = host || headersList.get("host") || ""

    if (currentHost) {
      // This would trigger revalidation of the cache tag
      await fetch(
        `${
          process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
        }/store/domain/context`,
        {
          method: "HEAD", // HEAD request to just invalidate cache
          headers: {
            "x-original-host": currentHost,
            "x-client-host": currentHost,
          },
        }
      )
    }
  } catch (error) {
    console.error("Error revalidating domain context:", error)
  }
}

// Helper function to get seller domain info
export function getSellerDomainInfo(domainContext: DomainContext | null) {
  if (!domainContext) {
    return {
      isSellerDomain: false,
      seller: null,
      domainType: "main" as const,
    }
  }

  const isSellerDomain =
    domainContext.context?.type === "subdomain" ||
    domainContext.context?.type === "custom"

  return {
    isSellerDomain,
    seller: domainContext.seller,
    domainType: domainContext.context?.type || "main",
    sellerId: domainContext.context?.seller_id,
  }
}

// Export types
export type { DomainContext }
