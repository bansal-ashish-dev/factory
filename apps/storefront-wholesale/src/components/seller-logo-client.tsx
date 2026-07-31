"use client"

import { useDomainContext } from "@lib/hooks/use-domain-context"
import SellerLogoImage from "./seller-logo-image"

interface SellerLogoClientProps {
  width?: number
  height?: number
  className?: string
  fallbackSrc?: string
  fallbackAlt?: string
}

// Client Component - for dynamic imports or when SSR is disabled
export default function SellerLogoClient({
  width = 120,
  height = 40,
  className = "",
  fallbackSrc = "/images/logo.svg",
  fallbackAlt = "ThreadBuy",
}: SellerLogoClientProps) {
  const { seller, isSellerDomain, loading } = useDomainContext()

  // Show loading state or fallback
  if (loading) {
    return (
      <SellerLogoImage
        src={fallbackSrc}
        alt={fallbackAlt}
        width={width}
        height={height}
        className={className}
        fallbackSrc={fallbackSrc}
        fallbackAlt={fallbackAlt}
      />
    )
  }

  // If seller domain and has seller with photo, show seller logo
  if (isSellerDomain && seller?.photo) {
    return (
      <SellerLogoImage
        src={seller.photo}
        alt={seller.name || "Seller logo"}
        width={width}
        height={height}
        className={className}
        fallbackSrc={fallbackSrc}
        fallbackAlt={fallbackAlt}
      />
    )
  }

  // Default logo
  return (
    <SellerLogoImage
      src={fallbackSrc}
      alt={fallbackAlt}
      width={width}
      height={height}
      className={className}
      fallbackSrc={fallbackSrc}
      fallbackAlt={fallbackAlt}
    />
  )
}
