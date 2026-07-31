"use client"

import { sdk } from "@lib/config"
import { useEffect, useState } from "react"

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

export function useDomainContext() {
  const [domainContext, setDomainContext] = useState<DomainContext | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDomainContext = async () => {
      try {
        const response = (await sdk.client.fetch(
          "/store/domain/context"
        )) as DomainContext
        if (response) {
          setDomainContext(response)
        }
      } catch (error) {
        console.error("Failed to fetch domain context:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDomainContext()
  }, [])

  return {
    domainContext,
    loading,
    isSellerDomain:
      domainContext?.context?.type === "subdomain" ||
      domainContext?.context?.type === "custom",
    seller: domainContext?.seller,
  }
}
