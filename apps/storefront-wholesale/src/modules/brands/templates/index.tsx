"use client"

import { StoreBrand } from "@lib/data/brands"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text, Button, Input } from "@medusajs/ui"
import { Store, ChevronLeft, ChevronRight, Search } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import BrandLogo from "../../../components/brand-logo"
import { useState } from "react"

type BrandsTemplateProps = {
  brands: StoreBrand[]
  region: HttpTypes.StoreRegion
  countryCode: string
  currentPage: number
  searchQuery?: string
  hasNextPage: boolean
  hasPreviousPage: boolean
  limit: number
}

const BrandsTemplate = ({
  brands,
  region,
  countryCode,
  currentPage,
  searchQuery,
  hasNextPage,
  hasPreviousPage,
  limit,
}: BrandsTemplateProps) => {
  const [searchInput, setSearchInput] = useState(searchQuery || "")

  // Function to properly capitalize brand names
  const capitalizeBrandName = (name: string) => {
    return name
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Build URL for pagination and search
  const buildUrl = (page?: number, query?: string) => {
    const params = new URLSearchParams()
    if (page && page > 1) params.set("page", page.toString())
    if (query && query.trim()) params.set("q", query.trim())

    const queryString = params.toString()
    return `/${countryCode}/brands${queryString ? `?${queryString}` : ""}`
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    window.location.href = buildUrl(1, searchInput)
  }

  return (
    <div className="bg-neutral-50 min-h-screen">
      <div className="content-container py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Heading level="h1" className="text-4xl font-bold text-gray-900 mb-2">
            Brands
          </Heading>
          <Text className="text-gray-600 text-lg">
            Discover all our featured brands
          </Text>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search brands..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" variant="primary">
              Search
            </Button>
          </form>
          {searchQuery && (
            <div className="mt-2 text-center">
              <Text className="text-sm text-gray-600">
                Showing results for "{searchQuery}"
                <button
                  onClick={() => (window.location.href = buildUrl(1))}
                  className="ml-2 text-blue-600 hover:text-blue-800 underline"
                >
                  Clear search
                </button>
              </Text>
            </div>
          )}
        </div>

        {/* Brands Grid */}
        <div className="max-w-7xl mx-auto">
          {brands.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-8">
              {brands.map((brand) => (
                <LocalizedClientLink
                  key={brand.id}
                  href={`/brands/${brand.handle}`}
                  className="group"
                >
                  <div className="flex flex-col items-center p-6 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    {/* Brand Logo */}
                    <div className="mb-4">
                      <BrandLogo
                        src={brand.thumbnail}
                        alt={brand.name}
                        size="large"
                        variant="circle"
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Brand Name */}
                    <div className="text-center">
                      <Text className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-300 leading-tight">
                        {capitalizeBrandName(brand.name)}
                      </Text>
                    </div>
                  </div>
                </LocalizedClientLink>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Store className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <Heading
                level="h3"
                className="text-2xl font-semibold text-gray-600 mb-3"
              >
                No brands found
              </Heading>
              <Text className="text-gray-500 text-lg">
                No brands are available at the moment
              </Text>
            </div>
          )}

          {/* Pagination Controls */}
          {(hasNextPage || hasPreviousPage) && (
            <div className="flex justify-center items-center gap-4 mt-12">
              {hasPreviousPage ? (
                <LocalizedClientLink
                  href={buildUrl(currentPage - 1, searchQuery)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </LocalizedClientLink>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-400 cursor-not-allowed">
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </div>
              )}

              <div className="flex items-center gap-2">
                <Text className="text-sm text-gray-600">
                  Page {currentPage}
                  {brands.length === limit && (
                    <span className="ml-1 text-gray-500">of many</span>
                  )}
                </Text>
              </div>

              {hasNextPage ? (
                <LocalizedClientLink
                  href={buildUrl(currentPage + 1, searchQuery)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </LocalizedClientLink>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-400 cursor-not-allowed">
                  Next
                  <ChevronRight className="w-4 h-4" />
                </div>
              )}
            </div>
          )}

          {/* Results Info */}
          {brands.length > 0 && (
            <div className="text-center mt-8">
              <Text className="text-sm text-gray-500">
                Showing {brands.length} brand{brands.length !== 1 ? "s" : ""}
                {currentPage > 1 && ` starting from page ${currentPage}`}
                {searchQuery && ` for "${searchQuery}"`}
              </Text>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BrandsTemplate
