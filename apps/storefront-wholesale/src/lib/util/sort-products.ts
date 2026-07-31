import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

interface MinPricedProduct extends HttpTypes.StoreProduct {
  _minPrice?: number
}

/**
 * Helper function to sort products client-side when server-side sorting is not available.
 * 
 * MedusaJS supports server-side sorting for fields like created_at, title, etc. using the `order` parameter.
 * However, price-based sorting requires client-side processing since it depends on calculated variant prices
 * which are computed dynamically and not directly sortable via the API.
 * 
 * @param products Array of products to sort
 * @param sortBy Sorting option
 * @returns products sorted according to the specified criteria
 */
export function sortProducts(
  products: HttpTypes.StoreProduct[],
  sortBy: SortOptions
): HttpTypes.StoreProduct[] {
  let sortedProducts = products as MinPricedProduct[]

  if (["price_asc", "price_desc"].includes(sortBy)) {
    // Price-based sorting: requires client-side processing since MedusaJS doesn't 
    // support sorting by calculated variant prices out of the box
    
    // Precompute the minimum price for each product
    sortedProducts.forEach((product) => {
      if (product.variants && product.variants.length > 0) {
        product._minPrice = Math.min(
          ...product.variants.map(
            (variant) => variant?.calculated_price?.calculated_amount || 0
          )
        )
      } else {
        product._minPrice = Infinity
      }
    })

    // Sort products based on the precomputed minimum prices
    sortedProducts.sort((a, b) => {
      const diff = a._minPrice! - b._minPrice!
      return sortBy === "price_asc" ? diff : -diff
    })
  }

  if (sortBy === "created_at") {
    // Note: This should typically be handled server-side via the `order` parameter
    // This fallback is for cases where server-side sorting wasn't used
    sortedProducts.sort((a, b) => {
      return (
        new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
      )
    })
  }

  return sortedProducts
}
