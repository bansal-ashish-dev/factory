"use client"

import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { listProducts } from "@lib/data/products"
import ProductPreview from "@modules/products/components/product-preview"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type MoreFromSellerProps = {
  seller: any
  currentProductId: string
  region: HttpTypes.StoreRegion
  countryCode: string
}

const MoreFromSeller = ({ seller, currentProductId, region, countryCode }: MoreFromSellerProps) => {
  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSellerProducts = async () => {
      try {
        setLoading(true)
        
        // Fetch products with seller information 
        // Note: We fetch more products since we'll filter by seller on frontend
        const response = await listProducts({
          countryCode,
          queryParams: {
            limit: 50, // Fetch more to filter by seller
            fields: "*variants.calculated_price,+metadata,+seller.*",
          },
        })

        // Filter products by seller on the frontend
        // Note: This is a temporary solution until backend supports seller filtering directly
        const sellerProducts = response.response.products.filter(
          (product: any) => product.seller?.id === seller.id && product.id !== currentProductId
        )

        setProducts(sellerProducts.slice(0, 4)) // Show max 4 products
      } catch (err) {
        console.error("Error fetching seller products:", err)
        setError("Failed to load products from this seller")
      } finally {
        setLoading(false)
      }
    }

    if (seller?.id) {
      fetchSellerProducts()
    }
  }, [seller?.id, currentProductId, countryCode])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Heading level="h2" className="text-2xl font-bold mb-2">
            More from {seller?.name || 'this seller'}
          </Heading>
          <Text className="text-ui-fg-subtle">Loading products...</Text>
        </div>
        <div className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-5 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-lg mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <Text className="text-ui-fg-subtle">{error}</Text>
      </div>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level="h2" className="text-2xl font-bold mb-2">
            More from {seller?.name}
          </Heading>
          <Text className="text-ui-fg-subtle">
            Discover other products from this seller
          </Text>
        </div>
        <LocalizedClientLink
          href={`/sellers/${seller?.handle || seller?.id}`}
          className="flex items-center gap-2 text-ui-fg-interactive hover:text-ui-fg-interactive-hover transition-colors"
        >
          <span className="text-sm font-medium">View all</span>
          <ArrowRight className="w-4 h-4" />
        </LocalizedClientLink>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductPreview 
            key={product.id} 
            product={product} 
            region={region} 
          />
        ))}
      </div>
    </div>
  )
}

export default MoreFromSeller
