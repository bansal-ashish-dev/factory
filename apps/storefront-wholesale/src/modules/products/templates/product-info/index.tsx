"use client"

import { HttpTypes } from "@medusajs/types"
import { Heading, Text, Button } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Share, Heart } from "lucide-react"
import { useState } from "react"
import { WishlistButton } from "@modules/common/components/wishlist-button"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

// Helper function to get variant MRP from metadata
const getVariantMRP = (
  variant: HttpTypes.StoreProductVariant
): number | null => {
  const mrp = variant?.metadata?.mrp
  return mrp ? parseFloat(mrp.toString()) : null
}

// Helper function to format currency
const formatCurrency = (amount: number, currencyCode = "INR") => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Share Button Component
const ProductShareButton = ({
  product,
  title,
  description,
}: {
  product: HttpTypes.StoreProduct
  title: string
  description: string
}) => {
  const handleShare = async () => {
    const url = `${window.location.origin}/products/${product.handle}`

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description || `Check out ${title}`,
          url,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url)
        navigator.clipboard.writeText(window.location.href)
      } catch (error) {
        console.error("Error copying to clipboard:", error)
      }
    }
  }

  return (
    <Button
      onClick={handleShare}
      variant="secondary"
      size="base"
      className="p-2"
    >
      <Share className="w-5 h-5 text-ui-fg-subtle" />
    </Button>
  )
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  // Calculate price range for multiple variants
  const priceRange =
    product.variants && product.variants.length > 1
      ? (() => {
          const prices = product.variants
            .map((variant) => {
              const { variantPrice } = getProductPrice({
                product,
                variantId: variant.id,
              })
              const priceNum = variantPrice?.calculated_price_number || 0
              return typeof priceNum === "number" ? priceNum : 0
            })
            .filter((price) => price > 0)

          if (prices.length === 0) return null

          const minPrice = Math.min(...prices)
          const maxPrice = Math.max(...prices)

          return {
            min: minPrice,
            max: maxPrice,
            hasRange: minPrice !== maxPrice,
          }
        })()
      : null

  // Calculate MRP range
  const mrpRange = product.variants
    ? (() => {
        const mrpValues = product.variants
          .map((variant) => getVariantMRP(variant))
          .filter((mrp) => mrp !== null) as number[]

        if (mrpValues.length === 0) return null

        const minMRP = Math.min(...mrpValues)
        const maxMRP = Math.max(...mrpValues)

        return {
          min: minMRP,
          max: maxMRP,
          hasRange: minMRP !== maxMRP,
        }
      })()
    : null

  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-6">
        {/* Collection */}
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-medium text-ui-fg-muted hover:text-ui-fg-subtle transition-colors"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}

        {/* Product Title */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <Heading
              level="h1"
              className="text-3xl lg:text-4xl leading-tight text-ui-fg-base font-bold flex-1"
              data-testid="product-title"
            >
              {product.title}
            </Heading>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <WishlistButton
                productId={product.id!}
                variant="secondary"
                size="base"
                className="p-2"
                productData={{
                  title: product.title,
                  handle: product.handle,
                  thumbnail: product.thumbnail || undefined,
                }}
              />
              <ProductShareButton
                product={product}
                title={product.title || ""}
                description={product.description || ""}
              />
            </div>
          </div>

          {product.subtitle && (
            <Text className="text-lg text-ui-fg-subtle">
              {product.subtitle}
            </Text>
          )}
        </div>

        {/* Pricing Information */}
        {priceRange && (
          <div className="space-y-3">
            {/* MRP Range */}
            {mrpRange && (
              <div className="flex items-center gap-2">
                <Text className="text-sm text-ui-fg-subtle">MRP:</Text>
                <Text className="text-lg text-ui-fg-subtle line-through">
                  {mrpRange.hasRange
                    ? `${formatCurrency(mrpRange.min)} - ${formatCurrency(
                        mrpRange.max
                      )}`
                    : formatCurrency(mrpRange.min)}
                </Text>
              </div>
            )}

            {/* Price Range */}
            <div className="flex items-baseline gap-3">
              <Text className="text-3xl font-bold text-ui-fg-base">
                {priceRange.hasRange
                  ? `${formatCurrency(priceRange.min)} - ${formatCurrency(
                      priceRange.max
                    )}`
                  : formatCurrency(priceRange.min)}
              </Text>
              {mrpRange && priceRange && (
                <span className="inline-flex items-center px-2 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                  Up to{" "}
                  {Math.round(
                    ((mrpRange.max - priceRange.min) / mrpRange.max) * 100
                  )}
                  % off
                </span>
              )}
            </div>
          </div>
        )}

        {/* Product Description */}
        {product.description && (
          <div className="space-y-2">
            <Heading
              level="h3"
              className="text-lg font-semibold text-ui-fg-base"
            >
              Description
            </Heading>
            <Text
              className="text-medium text-ui-fg-subtle whitespace-pre-line leading-relaxed"
              data-testid="product-description"
            >
              {product.description}
            </Text>
          </div>
        )}

        {/* Variants Count */}
        {product.variants && product.variants.length > 0 && (
          <div className="flex items-center gap-2">
            <Text className="text-sm text-ui-fg-subtle">
              {product.variants.length} variant
              {product.variants.length !== 1 ? "s" : ""} available
            </Text>
            {product.variants.length > 1 && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                Multiple options
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductInfo
