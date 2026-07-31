"use client"

import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

const MegaMenu = ({
  categories,
}: {
  categories: HttpTypes.StoreProductCategory[]
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<
    HttpTypes.StoreProductCategory["id"] | null
  >(null)

  const pathname = usePathname()
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const categoryTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Get only root categories (categories with no parent at all)
  const mainCategories = categories.filter(
    (category) => !category.parent_category
  )

  const getSubCategories = (categoryId: string) => {
    return categories.filter(
      (category) => category.parent_category?.id === categoryId
    )
  }

  const handleMenuHover = () => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current)
    }
    setIsHovered(true)
  }

  const handleMenuLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setIsHovered(false)
      setSelectedCategory(null)
    }, 300)
  }

  const handleCategoryHover = (categoryId: string) => {
    if (categoryTimeoutRef.current) {
      clearTimeout(categoryTimeoutRef.current)
    }
    categoryTimeoutRef.current = setTimeout(() => {
      setSelectedCategory(categoryId)
    }, 150)
  }

  const handleCategoryLeave = () => {
    if (categoryTimeoutRef.current) {
      clearTimeout(categoryTimeoutRef.current)
    }
  }

  useEffect(() => {
    setIsHovered(false)
    setSelectedCategory(null)
  }, [pathname])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (menuTimeoutRef.current) {
        clearTimeout(menuTimeoutRef.current)
      }
      if (categoryTimeoutRef.current) {
        clearTimeout(categoryTimeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      {mainCategories.length > 0 && (
        <div
          onMouseEnter={handleMenuHover}
          onMouseLeave={handleMenuLeave}
          className="relative z-50"
        >
          <LocalizedClientLink
            className="hover:text-ui-fg-base hover:bg-ui-bg-subtle rounded-lg px-3 py-2 transition-all duration-200 font-medium"
            href="/store"
          >
            Categories
          </LocalizedClientLink>
          {isHovered && (
            <div className="fixed left-0 right-0 top-[60px] w-full bg-white border-b border-ui-border-base shadow-lg overflow-hidden z-50">
              <div className="max-w-7xl mx-auto">
                <div className="flex min-h-[400px]">
                  {/* Main Categories Column */}
                  <div className="w-64 bg-ui-bg-subtle border-r border-ui-border-base p-6">
                    <h3 className="text-sm font-semibold text-ui-fg-muted uppercase tracking-wide mb-4 flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                      Shop by Category
                    </h3>
                    <div className="space-y-1">
                      {mainCategories.map((category) => (
                        <div
                          key={category.id}
                          className={clx(
                            "rounded-lg transition-all duration-200",
                            selectedCategory === category.id &&
                              "bg-white shadow-sm"
                          )}
                          onMouseEnter={() => handleCategoryHover(category.id)}
                          onMouseLeave={handleCategoryLeave}
                        >
                          <LocalizedClientLink
                            href={`/categories/${category.handle}`}
                            className={clx(
                              "block px-3 py-2 text-sm font-medium transition-colors duration-200",
                              selectedCategory === category.id
                                ? "text-ui-fg-base"
                                : "text-ui-fg-subtle hover:text-ui-fg-base"
                            )}
                          >
                            {category.name}
                          </LocalizedClientLink>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Subcategories Column */}
                  {selectedCategory && (
                    <div className="flex-1 p-6">
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                        {getSubCategories(selectedCategory).map((category) => (
                          <div key={category.id} className="space-y-3">
                            <LocalizedClientLink
                              className="block text-base font-semibold text-ui-fg-base hover:text-ui-fg-subtle transition-colors duration-200"
                              href={`/categories/${category.handle}`}
                            >
                              {category.name}
                            </LocalizedClientLink>
                            {getSubCategories(category.id).length > 0 && (
                              <div className="space-y-1">
                                {getSubCategories(category.id).map(
                                  (subCategory) => (
                                    <LocalizedClientLink
                                      key={subCategory.id}
                                      className="block text-sm text-ui-fg-muted hover:text-ui-fg-base transition-colors duration-200"
                                      href={`/categories/${subCategory.handle}`}
                                    >
                                      {subCategory.name}
                                    </LocalizedClientLink>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Default state when no category is selected */}
                  {!selectedCategory && (
                    <div className="flex-1 flex items-center justify-center p-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-ui-bg-subtle rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg
                            className="w-8 h-8 text-ui-fg-muted"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                          </svg>
                        </div>
                        <p className="text-ui-fg-muted text-sm">
                          Hover over a category to see subcategories
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default MegaMenu
