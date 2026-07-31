import { Container } from "@medusajs/ui"
import { SortOptions } from "../components/refinement-list/sort-products"
import { B2BCustomer } from "types/global"
import { listProductsWithSort } from "@lib/data/products"
import ProductPreview from "@modules/products/components/product-preview"
import { ProductPagination } from "../components/pagination"
import { getRegion } from "@lib/data/regions"

// Responsive limits for better grid layouts
const getProductLimit = () => {
  if (typeof window === "undefined") return 20 // Server-side default

  const width = window.innerWidth
  if (width < 640) return 12 // Mobile: 2 columns × 6 rows
  if (width < 768) return 15 // Small tablet: 3 columns × 5 rows
  if (width < 1024) return 18 // Tablet: 3 columns × 6 rows
  return 20 // Desktop: 4 columns × 5 rows
}

// Use responsive limits - will be 20 on server, dynamic on client
const getLimit = () => {
  try {
    return getProductLimit()
  } catch {
    return 20 // Fallback
  }
}

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
  customer_group_id?: string
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
  customer,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
  customer?: B2BCustomer | null
}) {
  const limit = getLimit()
  const queryParams: PaginatedProductsParams = {
    limit,
  }

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  } else if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  let {
    response: { products, count },
    nextPage,
  } = await listProductsWithSort({
    page,
    queryParams,
    sortBy,
    countryCode,
  })

  return (
    <>
      <ul
        className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 large:grid-cols-5 gap-x-2 gap-y-3 small:gap-x-3 small:gap-y-4"
        data-testid="products-list"
      >
        {products.length > 0 ? (
          products.map((p, index) => {
            // Prioritize first 4 products (above the fold)
            const isPriority = index < 4
            return (
              <li key={p.id}>
                <ProductPreview
                  product={p}
                  region={region}
                  priority={isPriority}
                />
              </li>
            )
          })
        ) : (
          <Container className="text-center text-sm text-neutral-500">
            No products found for this category.
          </Container>
        )}
      </ul>

      {/* Use proper count-based pagination */}
      <ProductPagination
        data-testid="product-pagination"
        currentPage={page}
        totalCount={count}
        limit={limit}
      />
    </>
  )
}
