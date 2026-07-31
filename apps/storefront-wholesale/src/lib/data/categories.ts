import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

// Optimized function for navigation/menu usage - no products
export const listCategories = async (query?: Record<string, any>) => {
  try {
    const next = {
      ...(await getCacheOptions("categories")),
    }

    const limit = query?.limit || 100

    return sdk.client
      .fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
        "/store/product-categories",
        {
          query: {
            fields:
              "id,name,handle,description,thumbnail,*category_children,*parent_category",
            limit,
            ...query,
          },
          next,
          cache: "force-cache",
        }
      )
      .then(({ product_categories }) => product_categories)
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    // Return empty array on error to prevent build failures
    // This ensures the site still builds even if the API is temporarily unavailable
    return []
  }
}

// Function for navigation - only categories with products (lightweight)
export const listCategoriesWithProductCount = async (
  query?: Record<string, any>
) => {
  try {
    const next = {
      ...(await getCacheOptions("categories")),
    }

    const limit = query?.limit || 100

    return sdk.client
      .fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
        "/store/product-categories",
        {
          query: {
            fields:
              "id,name,handle,description,thumbnail,*category_children,*parent_category,products.id",
            limit,
            ...query,
          },
          next,
          cache: "force-cache",
        }
      )
      .then(({ product_categories }) => {
        // Helper function to check if a category or its children have products
        const categoryOrChildrenHaveProducts = (category: any): boolean => {
          // Check if the category itself has products
          if (category.products && category.products.length > 0) {
            return true
          }

          // Check if any child categories have products
          if (
            category.category_children &&
            category.category_children.length > 0
          ) {
            return category.category_children.some((child: any) => {
              const childCategory = product_categories.find(
                (cat: any) => cat.id === child.id
              )
              return childCategory
                ? categoryOrChildrenHaveProducts(childCategory)
                : false
            })
          }

          return false
        }

        // Filter categories to include those with products or children with products
        return product_categories.filter(categoryOrChildrenHaveProducts)
      })
  } catch (error) {
    console.error("Failed to fetch categories with product count:", error)
    return []
  }
}

// Function for category pages that need products
export const listCategoriesWithProducts = async (
  query?: Record<string, any>
) => {
  try {
    const next = {
      ...(await getCacheOptions("categories")),
    }

    const limit = query?.limit || 50 // Reduced default limit

    return sdk.client
      .fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
        "/store/product-categories",
        {
          query: {
            fields:
              "id,name,handle,description,thumbnail,*category_children,*parent_category,*products",
            limit,
            ...query,
          },
          next,
          cache: "no-store", // Don't cache large responses
        }
      )
      .then(({ product_categories }) => product_categories)
  } catch (error) {
    console.error("Failed to fetch categories with products:", error)
    return []
  }
}

export const getCategoryByHandle = async (categoryHandle: string[]) => {
  try {
    const handle = `${categoryHandle.join("/")}`

    const next = {
      ...(await getCacheOptions("categories")),
    }

    return sdk.client
      .fetch<HttpTypes.StoreProductCategoryListResponse>(
        `/store/product-categories`,
        {
          query: {
            fields:
              "id,name,handle,description,thumbnail,*category_children,*parent_category,*products",
            handle,
          },
          next,
          cache: "no-store", // Don't cache large responses with products
        }
      )
      .then(({ product_categories }) => product_categories[0])
  } catch (error) {
    console.error("Failed to fetch category by handle:", error)
    // Return null during build failures to prevent build from crashing
    return null
  }
}
