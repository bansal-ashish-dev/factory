import { HttpTypes } from "@medusajs/types"
import { Container, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Radio from "@modules/common/components/radio"
import SquareMinus from "@modules/common/icons/square-minus"
import SquarePlus from "@modules/common/icons/square-plus"
import { usePathname, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

const CategoryList = ({
  categories,
  currentCategory,
}: {
  categories: HttpTypes.StoreProductCategory[]
  currentCategory?: HttpTypes.StoreProductCategory
}) => {
  // Helper function to check if a category has products (including in subcategories)
  const categoryHasProducts = useCallback(
    (category: HttpTypes.StoreProductCategory): boolean => {
      // Check if the category itself has products
      if (category.products && category.products.length > 0) {
        return true
      }

      // Check if any of its child categories have products
      return category.category_children.some((childId) => {
        const childCategory = categories.find((cat) => cat.id === childId.id)
        return childCategory ? categoryHasProducts(childCategory) : false
      })
    },
    [categories]
  )

  // Get total product count for a category (including subcategories)
  const getTotalProductCount = useCallback(
    (category: HttpTypes.StoreProductCategory): number => {
      let count = category.products?.length || 0

      category.category_children.forEach((childId) => {
        const childCategory = categories.find((cat) => cat.id === childId.id)
        if (childCategory) {
          count += getTotalProductCount(childCategory)
        }
      })

      return count
    },
    [categories]
  )

  // Filter categories to only include those with products
  const categoriesWithProducts = useCallback(
    (categoryList: HttpTypes.StoreProductCategory[]) => {
      return categoryList.filter(categoryHasProducts)
    },
    [categoryHasProducts]
  )

  const getCategoriesToExpand = useCallback(
    (category: HttpTypes.StoreProductCategory) => {
      const categoriesToExpand = [category.id]
      let current = category
      while (current.parent_category) {
        categoriesToExpand.push(current.parent_category.id)
        current = categories.find(
          (cat) => cat.id === current.parent_category?.id
        ) as HttpTypes.StoreProductCategory
      }
      return categoriesToExpand
    },
    [categories]
  )

  const [expandedCategories, setExpandedCategories] = useState<string[]>(() =>
    currentCategory ? getCategoriesToExpand(currentCategory) : []
  )

  const pathname = usePathname()

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const searchParams = useSearchParams()

  const isCurrentCategory = (handle: string) =>
    pathname.split("/").slice(2).join("/") === `categories/${handle}`

  useEffect(() => {
    if (currentCategory) {
      const categoriesToExpand = getCategoriesToExpand(currentCategory)
      setExpandedCategories((prev) => {
        const newCategories = categoriesToExpand.filter(
          (cat) => !prev.includes(cat)
        )
        return newCategories.length ? [...prev, ...newCategories] : prev
      })
    }
  }, [currentCategory, getCategoriesToExpand])

  const getCategoryMarginLeft = useCallback(
    (category: HttpTypes.StoreProductCategory) => {
      let level = 0
      let currentCategory = category
      while (currentCategory.parent_category) {
        level++
        currentCategory = categories.find(
          (cat) => cat.id === currentCategory.parent_category?.id
        ) as HttpTypes.StoreProductCategory
      }
      return level * 4
    },
    [categories]
  )

  const renderCategory = (category: HttpTypes.StoreProductCategory) => {
    const hasChildren = category.category_children.length > 0
    const isExpanded = expandedCategories.includes(category.id)
    const paddingLeft = getCategoryMarginLeft(category)
    const totalProductCount = getTotalProductCount(category)
    const directProductCount = category.products?.length || 0

    // Filter child categories to only show those with products
    const childrenWithProducts = categoriesWithProducts(
      category.category_children
        .map((childId) => categories.find((cat) => cat.id === childId.id))
        .filter(Boolean) as HttpTypes.StoreProductCategory[]
    )

    const hasChildrenWithProducts = childrenWithProducts.length > 0

    return (
      <li key={category.id}>
        <div className={`flex items-center gap-2 mb-2 pl-${paddingLeft}`}>
          {hasChildrenWithProducts ? (
            <div className="flex items-center gap-2 hover:text-neutral-700">
              <button
                onClick={() => toggleCategory(category.id)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                aria-label={
                  isExpanded ? "Collapse category" : "Expand category"
                }
              >
                {isExpanded ? (
                  <SquareMinus className="h-3 mx-1" />
                ) : (
                  <SquarePlus className="h-3 mx-1" />
                )}
              </button>
              <LocalizedClientLink
                href={`/categories/${category.handle}${
                  searchParams.size ? `?${searchParams.toString()}` : ""
                }`}
                className={`flex gap-2 items-center hover:text-neutral-700 transition-colors ${
                  isCurrentCategory(category.handle)
                    ? "text-blue-600 font-semibold"
                    : ""
                }`}
              >
                <span className="font-medium">{category.name}</span>
                <span className="text-xs text-neutral-400">
                  ({directProductCount}
                  {totalProductCount > directProductCount
                    ? `+${totalProductCount - directProductCount}`
                    : ""}
                  )
                </span>
              </LocalizedClientLink>
            </div>
          ) : (
            <LocalizedClientLink
              href={`/categories/${category.handle}${
                searchParams.size ? `?${searchParams.toString()}` : ""
              }`}
              className={`flex gap-2 items-center hover:text-neutral-700 text-start hover:cursor-pointer w-full transition-colors py-1 px-2 rounded ${
                isCurrentCategory(category.handle)
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "hover:bg-gray-50"
              }`}
            >
              <Radio checked={isCurrentCategory(category.handle)} />
              <span className="font-medium">{category.name}</span>
              <span className="text-xs text-neutral-400">
                ({directProductCount})
              </span>
            </LocalizedClientLink>
          )}
        </div>
        {hasChildrenWithProducts && isExpanded && (
          <ul className="border-l border-neutral-200 ml-2">
            {childrenWithProducts.map((childCategory) =>
              renderCategory(childCategory)
            )}
          </ul>
        )}
      </li>
    )
  }

  return (
    <Container className="flex flex-col p-0 divide-y divide-neutral-200">
      <div className="flex justify-between items-center p-3">
        <Text className="text-sm font-medium">Categories</Text>
        {pathname.includes("/categories") && (
          <LocalizedClientLink
            href="/store"
            className="text-xs text-neutral-500 hover:text-neutral-700"
          >
            Clear
          </LocalizedClientLink>
        )}
      </div>
      <div className="p-3">
        {/* Show total categories count */}
        <div className="mb-3 pb-2 border-b border-neutral-100">
          <Text className="text-xs text-neutral-400">
            Showing{" "}
            {
              categoriesWithProducts(
                categories.filter((cat) => !cat.parent_category)
              ).length
            }{" "}
            categories with products
          </Text>
          <Text className="text-xs text-neutral-300 mt-1">
            Numbers show direct products + subcategory products
          </Text>
        </div>
        <ul className="flex flex-col gap-3 text-sm text-neutral-500">
          {categoriesWithProducts(
            categories.filter((cat) => !cat.parent_category)
          ).map(renderCategory)}
        </ul>
        {categoriesWithProducts(
          categories.filter((cat) => !cat.parent_category)
        ).length === 0 && (
          <div className="text-center py-4 text-neutral-400">
            <Text className="text-sm">No categories with products found</Text>
          </div>
        )}
      </div>
    </Container>
  )
}

export default CategoryList
