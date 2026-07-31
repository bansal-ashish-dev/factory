"use client"

import { Container } from "@medusajs/ui"
import { SortOptions } from "../components/refinement-list/sort-products"
import { B2BCustomer } from "types/global"
import { listProductsWithSort } from "@lib/data/products"
import ProductPreview from "@modules/products/components/product-preview"
import { getRegion } from "@lib/data/regions"
import { useEffect, useState, useCallback, useRef } from "react"
import { HttpTypes } from "@medusajs/types"

const PRODUCT_LIMIT = 15

type InfiniteScrollProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
  customer_group_id?: string
}

interface InfiniteScrollProductsProps {
  sortBy?: SortOptions
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
  customer?: B2BCustomer | null
}

export default function InfiniteScrollProducts({
  sortBy,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
  customer,
}: InfiniteScrollProductsProps) {
  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [region, setRegion] = useState<HttpTypes.StoreRegion | null>(null)
  const observer = useRef<IntersectionObserver | null>(null)

  const lastProductElementRef = useCallback(
    (node: HTMLLIElement) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1)
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, hasMore]
  )

  useEffect(() => {
    const initializeRegion = async () => {
      const regionData = await getRegion(countryCode)
      setRegion(regionData || null)
    }
    initializeRegion()
  }, [countryCode])

  useEffect(() => {
    const loadProducts = async () => {
      if (!region) return

      setLoading(true)

      const queryParams: InfiniteScrollProductsParams = {
        limit: PRODUCT_LIMIT,
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

      try {
        const {
          response: { products: newProducts, count },
        } = await listProductsWithSort({
          page,
          queryParams,
          sortBy,
          countryCode,
        })

        if (page === 1) {
          setProducts(newProducts)
        } else {
          setProducts((prev) => [...prev, ...newProducts])
        }

        // Use actual products length instead of potentially incorrect count field
        // If we received fewer products than the limit, we've reached the end
        setHasMore(newProducts.length === PRODUCT_LIMIT)
      } catch (error) {
        console.error("Error loading products:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [page, sortBy, collectionId, categoryId, productsIds, countryCode, region])

  // Reset when sort or filters change
  useEffect(() => {
    setProducts([])
    setPage(1)
    setHasMore(true)
  }, [sortBy, collectionId, categoryId, productsIds])

  if (!region) {
    return (
      <Container className="text-center text-sm text-neutral-500">
        Loading...
      </Container>
    )
  }

  return (
    <>
      <ul
        className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-5 gap-3"
        data-testid="products-list"
      >
        {products.length > 0
          ? products.map((product, index) => {
              const isLastElement = products.length === index + 1
              return (
                <li
                  key={product.id}
                  ref={isLastElement ? lastProductElementRef : null}
                >
                  <ProductPreview product={product} region={region} />
                </li>
              )
            })
          : !loading && (
              <Container className="text-center text-sm text-neutral-500">
                No products found for this category.
              </Container>
            )}
      </ul>
      {loading && (
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 text-neutral-500">
            <div className="w-4 h-4 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin"></div>
            Loading more products...
          </div>
        </div>
      )}
      {!hasMore && products.length > 0 && (
        <div className="text-center py-4 text-neutral-500 text-sm">
          You've reached the end of the product list
        </div>
      )}
    </>
  )
}
