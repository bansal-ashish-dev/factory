import {
  getDomainContext,
  getSellerDomainInfo,
  type DomainContext,
} from "@lib/server/domain-context"
import dynamic from "next/dynamic"

interface SellerLogoProps {
  width?: number
  height?: number
  className?: string
  fallbackSrc?: string
  fallbackAlt?: string
}

// Dynamically import the client component with loading state
const SellerLogoImage = dynamic(() => import("./seller-logo-image"), {
  loading: () => (
    <div
      className="animate-pulse bg-gray-200 rounded"
      style={{ width: 120, height: 40 }}
    />
  ),
})

// Server Component - fetches data on server
export default async function SellerLogo({
  width = 120,
  height = 40,
  className = "",
  fallbackSrc = "/images/logo.svg",
  fallbackAlt = "ThreadBuy",
}: SellerLogoProps) {
  // Fetch domain context on server
  const domainContext = await getDomainContext()
  const { isSellerDomain, seller } = getSellerDomainInfo(domainContext)

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
