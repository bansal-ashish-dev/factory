"use client"

import { useEffect } from "react"
import { Metadata } from "next"
import { Heading, Text, Button } from "@medusajs/ui"
import { useWishlist } from "@providers/hybrid-wishlist-provider"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { WishlistButton } from "@modules/common/components/wishlist-button"
import { Share, ShoppingCart, Star } from "lucide-react"

export default function WishlistPage() {
  const {
    wishlistItems,
    isLoading,
    error,
    removeProduct,
    clearAllItems,
    lazyLoadWishlist,
    clearError,
  } = useWishlist()

  // Load wishlist when the wishlist page is visited
  useEffect(() => {
    lazyLoadWishlist()
  }, [lazyLoadWishlist])

  const handleShare = async (productHandle: string, productTitle: string) => {
    const url = `${window.location.origin}/products/${productHandle}`

    if (navigator.share) {
      navigator.share({
        title: "My Wishlist - Thread Buy",
        text: "Check out my wishlist on Thread Buy",
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (isLoading) {
    return (
      <div className="content-container py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ui-fg-interactive mx-auto mb-4"></div>
            <Text className="text-ui-fg-subtle">Loading your wishlist...</Text>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="content-container py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <Heading
              level="h2"
              className="text-xl font-semibold mb-4 text-red-600"
            >
              Error Loading Wishlist
            </Heading>
            <Text className="text-ui-fg-subtle mb-4">{error}</Text>
            <Button onClick={clearError} variant="secondary">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="content-container py-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Heading level="h1" className="text-3xl font-bold">
              My Wishlist
            </Heading>
            {wishlistItems.length > 0 && (
              <Button
                onClick={clearAllItems}
                variant="secondary"
                size="small"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Clear All
              </Button>
            )}
          </div>
          <Text className="text-ui-fg-subtle">
            {wishlistItems.length > 0
              ? `You have ${wishlistItems.length} item${
                  wishlistItems.length === 1 ? "" : "s"
                } in your wishlist.`
              : "Save products you're interested in and come back to them later."}
          </Text>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto mb-4 bg-ui-bg-subtle rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-ui-fg-muted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <Heading level="h2" className="text-xl font-semibold mb-2">
                Your wishlist is empty
              </Heading>
              <Text className="text-ui-fg-subtle mb-6">
                Start browsing products and add items to your wishlist to save
                them for later.
              </Text>
              <LocalizedClientLink
                href="/store"
                className="inline-flex items-center justify-center rounded-md bg-ui-bg-interactive px-6 py-3 text-small-regular text-white hover:bg-ui-bg-interactive-hover transition-colors"
              >
                Continue Shopping
              </LocalizedClientLink>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => {
              // With the new data structure, product data is directly available
              const product = item.product

              // Skip items without product data but show a placeholder with option to reload
              if (
                !product ||
                !product.title ||
                product.title === "Unknown Product"
              ) {
                console.warn("No product data found for wishlist item:", item)
                return (
                  <div
                    key={item.id}
                    className="group border border-ui-border-base rounded-lg overflow-hidden p-4 bg-ui-bg-subtle"
                  >
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 bg-ui-bg-base rounded-lg flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-ui-fg-muted"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                      </div>
                      <Text className="text-ui-fg-muted text-sm mb-3">
                        Product details are not available
                      </Text>
                      <Text className="text-xs text-ui-fg-subtle mb-4">
                        This item was saved to your wishlist but the product
                        details couldn't be loaded.
                      </Text>
                      <div className="flex gap-2 justify-center">
                        <Button
                          onClick={() => window.location.reload()}
                          variant="secondary"
                          size="small"
                          className="text-xs"
                        >
                          Refresh Page
                        </Button>
                        <WishlistButton
                          productId={item.reference_id}
                          variant="danger"
                          size="small"
                          showText={false}
                          className="text-red-500 hover:text-red-600"
                        />
                      </div>
                    </div>
                  </div>
                )
              }

              return (
                <div
                  key={item.id}
                  className="group border border-ui-border-base rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 bg-white"
                >
                  <div className="relative">
                    {product.handle ? (
                      <LocalizedClientLink href={`/products/${product.handle}`}>
                        <Thumbnail
                          thumbnail={product.thumbnail}
                          images={[]}
                          size="full"
                          className="aspect-square object-cover"
                        />
                      </LocalizedClientLink>
                    ) : (
                      <div className="aspect-square bg-ui-bg-subtle flex items-center justify-center">
                        <Text className="text-ui-fg-muted">No Image</Text>
                      </div>
                    )}

                    {/* Action buttons */}
                    {product.handle && (
                      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          onClick={() =>
                            handleShare(
                              product.handle!,
                              product.title || "Product"
                            )
                          }
                          variant="secondary"
                          size="small"
                          className="w-9 h-9 p-0 bg-white/95 hover:bg-white shadow-lg border border-gray-200 rounded-full"
                        >
                          <Share className="w-4 h-4" />
                        </Button>
                      </div>
                    )}

                    {/* Wishlist badge */}
                    <div className="absolute top-3 left-3">
                      <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <span>♥</span> Saved
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="mb-3">
                      {product.handle ? (
                        <LocalizedClientLink
                          href={`/products/${product.handle}`}
                        >
                          <Heading
                            level="h3"
                            className="text-base font-semibold mb-2 line-clamp-2 hover:text-ui-fg-interactive transition-colors"
                          >
                            {product.title || "Untitled Product"}
                          </Heading>
                        </LocalizedClientLink>
                      ) : (
                        <Heading
                          level="h3"
                          className="text-base font-semibold mb-2 line-clamp-2"
                        >
                          {product.title || "Untitled Product"}
                        </Heading>
                      )}
                      {product.description && (
                        <Text className="text-sm text-ui-fg-subtle line-clamp-2 mb-3">
                          {product.description}
                        </Text>
                      )}

                      {/* Product availability indicator */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <Text className="text-xs text-ui-fg-subtle">
                          Available
                        </Text>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <WishlistButton
                        productId={item.reference_id}
                        variant="transparent"
                        size="small"
                        showText={false}
                        className="text-red-500 hover:text-red-600"
                      />

                      {product.handle ? (
                        <LocalizedClientLink
                          href={`/products/${product.handle}`}
                        >
                          <Button
                            variant="secondary"
                            size="small"
                            className="text-xs flex-1"
                          >
                            <ShoppingCart className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                        </LocalizedClientLink>
                      ) : (
                        <Button
                          variant="secondary"
                          size="small"
                          className="text-xs flex-1"
                          disabled
                        >
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Unavailable
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
