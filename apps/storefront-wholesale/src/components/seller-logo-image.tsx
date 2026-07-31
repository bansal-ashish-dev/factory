"use client"

import Image from "next/image"
import { useState } from "react"

interface SellerLogoImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  fallbackSrc: string
  fallbackAlt: string
}

// Client Component - handles Image error events
export default function SellerLogoImage({
  src,
  alt,
  width,
  height,
  className = "",
  fallbackSrc,
  fallbackAlt,
}: SellerLogoImageProps) {
  const [imageSrc, setImageSrc] = useState(src)
  const [imageAlt, setImageAlt] = useState(alt)

  const handleError = () => {
    // Fallback to default logo on error
    setImageSrc(fallbackSrc)
    setImageAlt(fallbackAlt)
  }

  return (
    <Image
      src={imageSrc}
      alt={imageAlt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      priority
    />
  )
}
