"use client"

import { Text } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import { Heart, Share } from "lucide-react"
import React from "react"
import { WishlistButton } from "@modules/common/components/wishlist-button"

export default function CompactProductPreview({
  product,
  region,
  priority = false,
}: {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  priority?: boolean
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const url = `${window.location.origin}/products/${product.handle}`

    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out this product on Thread Buy: ${product.title}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="group relative isolate flex-shrink-0 w-48 sm:w-56">
      <div data-testid="compact-product-wrapper" className="relative">
        <LocalizedClientLink
          href={`/products/${product.handle}`}
          className="block"
        >
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            priority={priority}
          />
        </LocalizedClientLink>

        {/* Overlay buttons - always visible */}
        <div className="absolute top-1 right-1 flex flex-col gap-1 z-10 hidden sm:flex">
          <WishlistButton
            productId={product.id!}
            variant="secondary"
            size="small"
            className="w-5 h-5 p-0 bg-white/95 hover:bg-white shadow-lg border border-gray-200 rounded-full"
            productData={{
              title: product.title,
              handle: product.handle,
              thumbnail: product.thumbnail || undefined,
            }}
          />
          <button
            onClick={handleShare}
            className="w-5 h-5 p-0 bg-white/95 hover:bg-white shadow-lg border border-gray-200 rounded-full flex items-center justify-center"
          >
            <Share className="w-2.5 h-2.5" />
          </button>
        </div>

        <LocalizedClientLink
          href={`/products/${product.handle}`}
          className="block"
        >
          <div className="flex flex-col mt-2 gap-y-1 p-1">
            <div className="flex flex-col gap-1">
              <Text
                className="text-ui-fg-subtle text-xs font-medium leading-tight line-clamp-2"
                data-testid="compact-product-title"
              >
                {product.title}
              </Text>
              {cheapestPrice && (
                <div className="flex items-center gap-x-1">
                  <Text className="text-ui-fg-base font-semibold text-sm">
                    {cheapestPrice.calculated_price}
                  </Text>
                </div>
              )}
            </div>

            {product.description && (
              <Text
                className="text-ui-fg-muted text-xs overflow-hidden leading-tight line-clamp-1"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical" as const,
                }}
              >
                {product.description}
              </Text>
            )}
          </div>
        </LocalizedClientLink>
      </div>
    </div>
  )
}
