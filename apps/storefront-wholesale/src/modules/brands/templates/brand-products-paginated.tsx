import { Container } from "@medusajs/ui"
import { getBrandProducts } from "@lib/data/brands"
import ProductPreview from "@modules/products/components/product-preview"
import { ProductPagination } from "@modules/store/components/pagination"
import { HttpTypes } from "@medusajs/types"
import { Package } from "lucide-react"
import { Heading, Text } from "@medusajs/ui"

// Responsive limits for better grid layouts
const getProductLimit = () => {
  if (typeof window === "undefined") return 20 // Server-side default

  const width = window.innerWidth
  if (width < 640) return 10 // Mobile: 2 columns × 5 rows
  if (width < 1024) return 15 // Tablet: 3 columns × 5 rows
  return 20 // Desktop: 5 columns × 4 rows
}

const getLimit = () => {
  try {
    return getProductLimit()
  } catch {
    return 20 // Fallback
  }
}

interface BrandProductsPaginatedProps {
  brandHandle: string
  page: number
  region: HttpTypes.StoreRegion
}

export default async function BrandProductsPaginated({
  brandHandle,
  page,
  region,
}: BrandProductsPaginatedProps) {
  const limit = getLimit()
  const result = await getBrandProducts(brandHandle, {
    limit,
    offset: (page - 1) * limit,
  })

  const { products, hasMore, total } = result

  // Reliable pagination logic
  const canGoPrev = page > 1
  const canGoNext = hasMore

  const emptyState = (
    <div className="text-center py-12">
      <Package className="w-16 h-16 text-ui-fg-muted mx-auto mb-4" />
      <Heading level="h3" className="text-xl font-semibold mb-2">
        No products available
      </Heading>
      <Text className="text-ui-fg-subtle">
        This brand doesn't have any products yet.
      </Text>
    </div>
  )

  if (products.length === 0 && page === 1) {
    return emptyState
  }

  return (
    <>
      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-5 gap-x-3 gap-y-4">
        {products.map((product: HttpTypes.StoreProduct) => (
          <li key={product.id}>
            <ProductPreview
              product={product}
              region={region}
              isFeatured={false}
            />
          </li>
        ))}
      </ul>

      {/* Use reliable pagination */}
      {(canGoPrev || canGoNext) && (
        <ProductPagination
          data-testid="brand-product-pagination"
          currentPage={page}
          totalCount={total}
          limit={limit}
        />
      )}
    </>
  )
}
