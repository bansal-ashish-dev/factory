import dynamic from "next/dynamic"
import SellerLogoImage from "./seller-logo-image"

interface SellerLogoProps {
  width?: number
  height?: number
  className?: string
  fallbackSrc?: string
  fallbackAlt?: string
}

// Dynamically import the client component with SSR disabled
const SellerLogoDynamic = dynamic(() => import("./seller-logo-client"), {
  ssr: false,
  loading: (props: SellerLogoProps) => (
    <SellerLogoImage
      src={props.fallbackSrc || "/images/logo.svg"}
      alt={props.fallbackAlt || "ThreadBuy"}
      width={props.width || 120}
      height={props.height || 40}
      className={props.className || ""}
      fallbackSrc={props.fallbackSrc || "/images/logo.svg"}
      fallbackAlt={props.fallbackAlt || "ThreadBuy"}
    />
  ),
})

export default SellerLogoDynamic
