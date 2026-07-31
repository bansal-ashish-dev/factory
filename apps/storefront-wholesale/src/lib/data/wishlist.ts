"use server"

import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders } from "./cookies"
import { revalidatePath } from "next/cache"

export interface WishlistItem {
  id: string // This will be the wishlist entry ID + product ID combination
  wishlist_id: string // The actual wishlist entry ID from backend
  reference: "product"
  reference_id: string
  created_at: string
  updated_at: string
  deleted_at?: string
  product: {
    id: string
    title: string
    handle: string
    thumbnail?: string
    description?: string
    variants?: HttpTypes.StoreProductVariant[]
  }
}

export interface WishlistResponse {
  wishlists: WishlistItem[]
  count: number
  offset: number
  limit: number
}

// Get all wishlist items for the authenticated user
export const getWishlist = async (): Promise<WishlistResponse | null> => {
  try {
    const headers = {
      ...(await getAuthHeaders()),
      "Content-Type": "application/json",
      "x-publishable-api-key": process.env
        .NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY as string,
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/wishlist`,
      {
        method: "GET",
        headers,
        cache: "no-cache",
      }
    )

    if (response.ok) {
      const data = await response.json()
      console.log("Wishlist API response:", JSON.stringify(data, null, 2))

      // Transform the backend response to flatten products into individual wishlist items
      const flattenedWishlistItems: WishlistItem[] = []

      if (data.wishlists && Array.isArray(data.wishlists)) {
        for (const wishlistEntry of data.wishlists) {
          if (wishlistEntry.products && Array.isArray(wishlistEntry.products)) {
            // Each product in the wishlist becomes a separate wishlist item
            // Filter out items that don't have a valid product ID (price calculation objects)
            for (const product of wishlistEntry.products) {
              if (product.id && product.title && product.handle) {
                flattenedWishlistItems.push({
                  id: `${wishlistEntry.id}_${product.id}`, // Combine wishlist ID and product ID
                  wishlist_id: wishlistEntry.id, // Store the original wishlist entry ID
                  reference: "product",
                  reference_id: product.id,
                  created_at:
                    wishlistEntry.created_at || new Date().toISOString(),
                  updated_at:
                    wishlistEntry.updated_at || new Date().toISOString(),
                  deleted_at: wishlistEntry.deleted_at,
                  product: product,
                })
              }
            }
          }
        }
      }

      return {
        wishlists: flattenedWishlistItems,
        count: flattenedWishlistItems.length,
        offset: data.offset || 0,
        limit: data.limit || 50,
      }
    } else {
      console.error(
        "Get wishlist failed:",
        response.status,
        response.statusText
      )
      return { wishlists: [], count: 0, offset: 0, limit: 0 }
    }
  } catch (error) {
    console.error("Error fetching wishlist:", error)
    // Return empty wishlist on error instead of null
    return { wishlists: [], count: 0, offset: 0, limit: 0 }
  }
}

// Add a product to the wishlist
export const addToWishlist = async (productId: string): Promise<boolean> => {
  try {
    const headers = {
      ...(await getAuthHeaders()),
      "Content-Type": "application/json",
      "x-publishable-api-key": process.env
        .NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY as string,
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/wishlist`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          reference: "product",
          reference_id: productId,
        }),
      }
    )

    if (response.ok) {
      revalidatePath("/wishlist")
      return true
    } else {
      console.error(
        "Add to wishlist failed:",
        response.status,
        response.statusText
      )
      return false
    }
  } catch (error) {
    console.error("Error adding to wishlist:", error)
    return false
  }
}

// Remove a product from the wishlist
export const removeFromWishlist = async (
  wishlistEntryId: string, // This should be the actual wishlist entry ID, not the combined ID
  productId: string
): Promise<boolean> => {
  try {
    const headers = {
      ...(await getAuthHeaders()),
      "Content-Type": "application/json",
      "x-publishable-api-key": process.env
        .NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY as string,
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/wishlist/${wishlistEntryId}/product/${productId}`,
      {
        method: "DELETE",
        headers,
      }
    )

    if (response.ok) {
      revalidatePath("/wishlist")
      return true
    } else {
      console.error(
        "Remove from wishlist failed:",
        response.status,
        response.statusText
      )
      return false
    }
  } catch (error) {
    console.error("Error removing from wishlist:", error)
    return false
  }
}

// Check if a product is in the wishlist
// Note: This function is now handled by the wishlist provider using local state
// Keeping it for backward compatibility but it's recommended to use the provider
export const isInWishlist = async (productId: string): Promise<boolean> => {
  try {
    // Get the full wishlist and check if the product is in it
    const wishlist = await getWishlist()
    if (!wishlist) return false

    return wishlist.wishlists.some((item) => item.reference_id === productId)
  } catch (error) {
    console.error("Error checking wishlist status:", error)
    return false
  }
}
