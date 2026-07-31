"use client"

import { Text, Button } from "@medusajs/ui"
import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import { Heart, Share } from "lucide-react"
import React from "react"
import { WishlistButton } from "@modules/common/components/wishlist-button"

export default function ProductPreview({
  product,
  isFeatured,
  region,
  priority = false,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
  priority?: boolean
}) {
  // const pricedProduct = await listProducts({
  //   regionId: region.id,
  //   queryParams: { id: [product.id!] },
  // }).then(({ response }) => response.products[0])

  // if (!pricedProduct) {
  //   return null
  // }

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
    <div className="group relative isolate">
      <div data-testid="product-wrapper" className="relative">
        <LocalizedClientLink
          href={`/products/${product.handle}`}
          className="block"
        >
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
            priority={priority}
          />
        </LocalizedClientLink>

        {/* Overlay buttons - always visible */}
        <div className="absolute top-1 right-1 flex flex-col gap-1 z-10 hidden small:flex">
          <WishlistButton
            productId={product.id!}
            variant="secondary"
            size="small"
            className="w-6 h-6 p-0 bg-white/95 hover:bg-white shadow-lg border border-gray-200 rounded-full"
            productData={{
              title: product.title,
              handle: product.handle,
              thumbnail: product.thumbnail || undefined,
            }}
          />
          <Button
            onClick={handleShare}
            variant="secondary"
            size="small"
            className="w-6 h-6 p-0 bg-white/95 hover:bg-white shadow-lg border border-gray-200 rounded-full"
          >
            <Share className="w-3 h-3" />
          </Button>
        </div>

        <LocalizedClientLink
          href={`/products/${product.handle}`}
          className="block"
        >
          <div className="flex flex-col mt-2 gap-y-1 p-1">
            <div className="flex flex-col gap-1">
              <Text
                className="text-ui-fg-subtle text-xs small:text-sm font-medium leading-tight line-clamp-2"
                data-testid="product-title"
              >
                {product.title}
              </Text>
              {cheapestPrice && (
                <div className="flex items-center gap-x-1">
                  <Text className="text-ui-fg-base font-semibold text-sm small:text-base">
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

            {/* Category and collection info */}
            <div className="flex items-center gap-x-1 text-xs text-ui-fg-muted">
              {product.categories && product.categories.length > 0 && (
                <span className="bg-ui-bg-subtle px-1.5 py-0.5 rounded-full text-xs truncate">
                  {product.categories[0].name}
                </span>
              )}
            </div>
          </div>
        </LocalizedClientLink>
      </div>
    </div>
  )
}
