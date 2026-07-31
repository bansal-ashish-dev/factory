// Client-side local wishlist utilities for non-authenticated users
// This runs only on the client side and uses localStorage

import { WishlistItem } from "@lib/data/wishlist"
import { HttpTypes } from "@medusajs/types"

const LOCAL_WISHLIST_KEY = "threadbuy_wishlist"

export interface LocalWishlistItem {
  id: string
  productId: string
  addedAt: string
  productData?: {
    title: string
    handle: string
    thumbnail?: string
    price?: string
  }
  // Store full product data for better display
  fullProduct?: HttpTypes.StoreProduct
}

export interface LocalWishlistStorage {
  items: LocalWishlistItem[]
  version: number
  lastUpdated: string
}

// Check if we're in browser environment
const isClient = typeof window !== "undefined"

// Get local wishlist from localStorage
export const getLocalWishlist = (): LocalWishlistStorage => {
  if (!isClient) {
    return { items: [], version: 1, lastUpdated: new Date().toISOString() }
  }

  try {
    const stored = localStorage.getItem(LOCAL_WISHLIST_KEY)
    if (!stored) {
      return { items: [], version: 1, lastUpdated: new Date().toISOString() }
    }

    const parsed = JSON.parse(stored) as LocalWishlistStorage
    return parsed
  } catch (error) {
    console.error("Error reading local wishlist:", error)
    return { items: [], version: 1, lastUpdated: new Date().toISOString() }
  }
}

// Save local wishlist to localStorage
export const saveLocalWishlist = (wishlist: LocalWishlistStorage): void => {
  if (!isClient) return

  try {
    wishlist.lastUpdated = new Date().toISOString()
    localStorage.setItem(LOCAL_WISHLIST_KEY, JSON.stringify(wishlist))
  } catch (error) {
    console.error("Error saving local wishlist:", error)
  }
}

// Add product to local wishlist
export const addToLocalWishlist = (
  productId: string,
  productData?: LocalWishlistItem["productData"],
  fullProduct?: HttpTypes.StoreProduct
): boolean => {
  if (!isClient) return false

  try {
    const wishlist = getLocalWishlist()
    
    // Check if product already exists
    if (wishlist.items.some(item => item.productId === productId)) {
      return false // Already in wishlist
    }

    const newItem: LocalWishlistItem = {
      id: `local_${Date.now()}_${productId}`,
      productId,
      addedAt: new Date().toISOString(),
      productData,
      fullProduct
    }

    wishlist.items.push(newItem)
    saveLocalWishlist(wishlist)
    return true
  } catch (error) {
    console.error("Error adding to local wishlist:", error)
    return false
  }
}

// Remove product from local wishlist
export const removeFromLocalWishlist = (productId: string): boolean => {
  if (!isClient) return false

  try {
    const wishlist = getLocalWishlist()
    const initialLength = wishlist.items.length
    
    wishlist.items = wishlist.items.filter(item => item.productId !== productId)
    
    if (wishlist.items.length !== initialLength) {
      saveLocalWishlist(wishlist)
      return true
    }
    return false
  } catch (error) {
    console.error("Error removing from local wishlist:", error)
    return false
  }
}

// Check if product is in local wishlist
export const isProductInLocalWishlist = (productId: string): boolean => {
  if (!isClient) return false

  try {
    const wishlist = getLocalWishlist()
    return wishlist.items.some(item => item.productId === productId)
  } catch (error) {
    console.error("Error checking local wishlist:", error)
    return false
  }
}

// Get local wishlist count
export const getLocalWishlistCount = (): number => {
  if (!isClient) return 0

  try {
    const wishlist = getLocalWishlist()
    return wishlist.items.length
  } catch (error) {
    console.error("Error getting local wishlist count:", error)
    return 0
  }
}

// Clear local wishlist (useful when user logs in and syncs to server)
export const clearLocalWishlist = (): void => {
  if (!isClient) return

  try {
    localStorage.removeItem(LOCAL_WISHLIST_KEY)
  } catch (error) {
    console.error("Error clearing local wishlist:", error)
  }
}

// Convert local wishlist items to server format for syncing
export const convertLocalToServerFormat = (localItems: LocalWishlistItem[]): string[] => {
  return localItems.map(item => item.productId)
}
