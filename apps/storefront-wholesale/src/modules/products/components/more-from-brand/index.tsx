import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import { ArrowRight } from "lucide-react"
import ProductPreview from "@modules/products/components/product-preview"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type MoreFromBrandProps = {
  brand: any
  brandProducts?: HttpTypes.StoreProduct[]
  currentProductId: string
  region: HttpTypes.StoreRegion
  countryCode: string
}

const MoreFromBrand = ({ brand, brandProducts = [], currentProductId, region, countryCode }: MoreFromBrandProps) => {
  if (!brand) return null

  // Ensure brandProducts is an array before filtering
  const products = Array.isArray(brandProducts) ? brandProducts : []
  
  // Filter out the current product and show only first 4
  const filteredProducts = products
    .filter(p => p.id !== currentProductId)
    .slice(0, 4)

  if (filteredProducts.length === 0) return null

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level="h2" className="text-2xl font-bold mb-2">
            More from {brand?.name}
          </Heading>
          <Text className="text-neutral-600">
            Discover other products from this brand
          </Text>
        </div>
        
        <LocalizedClientLink href={`/brands/${brand.handle || brand.id}`}>
          <div className="flex items-center gap-2 text-neutral-600 hover:text-neutral-800 transition-colors cursor-pointer">
            <Text className="font-medium">View all</Text>
            <ArrowRight className="w-4 h-4" />
          </div>
        </LocalizedClientLink>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-5 gap-4">
        {filteredProducts.map((product) => (
          <ProductPreview
            key={product.id}
            product={product}
            region={region}
            isFeatured={false}
          />
        ))}
      </div>
    </div>
  )
}

export default MoreFromBrand
