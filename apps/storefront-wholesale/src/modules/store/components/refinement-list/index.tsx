"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"

import SortProducts, { SortOptions } from "./sort-products"
import { Container, Button } from "@medusajs/ui"
import SearchInResults from "./search-in-results"
import { HttpTypes } from "@medusajs/types"
import CategoryList from "./category-list"
import { Filter, X } from "lucide-react"

type RefinementListProps = {
  sortBy: SortOptions
  listName?: string
  "data-testid"?: string
  categories?: HttpTypes.StoreProductCategory[]
  currentCategory?: HttpTypes.StoreProductCategory
}

const RefinementList = ({
  sortBy,
  listName,
  "data-testid": dataTestId,
  categories,
  currentCategory,
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`)
  }

  const toggleMobileFilters = () => {
    setIsMobileFiltersOpen(!isMobileFiltersOpen)
  }

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <div className="small:hidden mb-4">
        <Button
          onClick={toggleMobileFilters}
          variant="secondary"
          className="w-full flex items-center justify-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters & Sort
          {isMobileFiltersOpen && <X className="w-4 h-4" />}
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden small:flex flex-col divide-neutral-200 gap-3">
        <Container className="flex flex-col divide-y divide-neutral-200 p-0 w-full">
          <SearchInResults listName={listName} />
          <SortProducts
            sortBy={sortBy}
            setQueryParams={setQueryParams}
            data-testid={dataTestId}
          />
        </Container>
        {categories && (
          <CategoryList
            categories={categories}
            currentCategory={currentCategory}
          />
        )}
      </div>

      {/* Mobile Filters Overlay */}
      {isMobileFiltersOpen && (
        <div
          className="small:hidden fixed inset-0 z-50 bg-black/50"
          onClick={toggleMobileFilters}
        >
          <div
            className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Filters & Sort</h3>
              <Button
                onClick={toggleMobileFilters}
                variant="transparent"
                size="small"
                className="p-1"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-4 space-y-4">
              <Container className="flex flex-col divide-y divide-neutral-200 p-0 w-full">
                <SearchInResults listName={listName} />
                <SortProducts
                  sortBy={sortBy}
                  setQueryParams={setQueryParams}
                  data-testid={dataTestId}
                />
              </Container>
              {categories && (
                <CategoryList
                  categories={categories}
                  currentCategory={currentCategory}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default RefinementList
