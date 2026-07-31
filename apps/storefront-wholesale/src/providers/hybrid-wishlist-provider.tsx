"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"
import { HttpTypes } from "@medusajs/types"
import {
  WishlistItem,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "@lib/data/wishlist"
import {
  addToLocalWishlist,
  removeFromLocalWishlist,
  isProductInLocalWishlist,
  getLocalWishlistCount,
  getLocalWishlist,
  clearLocalWishlist,
  convertLocalToServerFormat,
  LocalWishlistItem,
} from "@lib/local-wishlist"
import { useToast } from "./toast-provider"

interface WishlistContextType {
  wishlistItems: WishlistItem[]
  isLoading: boolean
  error: string | null
  addProduct: (productId: string, productData?: any) => Promise<void>
  removeProduct: (productId: string) => Promise<void>
  clearAllItems: () => Promise<void> // New clear all function
  isProductInWishlist: (productId: string) => boolean
  refreshWishlist: () => Promise<void>
  lazyLoadWishlist: () => Promise<void>
  wishlistCount: number
  clearError: () => void
  syncLocalToServer: () => Promise<void>
  isAuthenticated: boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
)

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}

interface WishlistProviderProps {
  children: React.ReactNode
  isAuthenticated?: boolean
}

export const HybridWishlistProvider: React.FC<WishlistProviderProps> = ({
  children,
  isAuthenticated = false,
}) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [localWishlistItems, setLocalWishlistItems] = useState<LocalWishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastFetchTime, setLastFetchTime] = useState<number>(0)
  const [hasInitialized, setHasInitialized] = useState(false)
  const [loadingPromise, setLoadingPromise] = useState<Promise<void> | null>(null)
  const { addToast } = useToast()

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Load local wishlist items
  const loadLocalWishlist = useCallback(() => {
    if (typeof window !== "undefined") {
      const localWishlist = getLocalWishlist()
      setLocalWishlistItems(localWishlist.items)
    }
  }, [])

  // Refresh server wishlist for authenticated users
  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      loadLocalWishlist()
      return
    }

    const now = Date.now()
    // Debounce API calls - don't fetch more than once per second
    if (now - lastFetchTime < 1000) {
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      setLastFetchTime(now)
      const wishlistData = await getWishlist()
      if (wishlistData) {
        setWishlistItems(wishlistData.wishlists)
      } else {
        setWishlistItems([])
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error)
      setError(
        error instanceof Error ? error.message : "Failed to fetch wishlist"
      )
      setWishlistItems([])
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, lastFetchTime, loadLocalWishlist])

  // Lazy load wishlist
  const lazyLoadWishlist = useCallback(async () => {
    if (hasInitialized) {
      return
    }

    if (loadingPromise) {
      return loadingPromise
    }

    const promise = (async () => {
      try {
        setHasInitialized(true)
        if (isAuthenticated) {
          await refreshWishlist()
        } else {
          loadLocalWishlist()
        }
      } catch (error) {
        console.error("Error in lazy load wishlist:", error)
        setError(
          error instanceof Error ? error.message : "Failed to load wishlist"
        )
      } finally {
        setLoadingPromise(null)
      }
    })()

    setLoadingPromise(promise)
    return promise
  }, [hasInitialized, loadingPromise, refreshWishlist, loadLocalWishlist, isAuthenticated])

  // Add product to wishlist
  const addProduct = useCallback(
    async (productId: string, productData?: any) => {
      try {
        setError(null)

        if (isAuthenticated) {
          // Server-based wishlist for authenticated users
          await lazyLoadWishlist()
          const success = await addToWishlist(productId)
          if (success) {
            await refreshWishlist()
            addToast("Product added to wishlist", "success")
          } else {
            setError("Product is already in wishlist")
            addToast("Product is already in wishlist", "info")
          }
        } else {
          // Local wishlist for non-authenticated users
          // Try to fetch full product data for better display
          let fullProduct: HttpTypes.StoreProduct | undefined
          
          // If we have access to window and can determine country code
          if (typeof window !== "undefined" && productData?.countryCode) {
            try {
              // Dynamic import to avoid server-side issues
              const { getProductById } = await import("@lib/data/products")
              fullProduct = await getProductById(productId, productData.countryCode) || undefined
            } catch (error) {
              console.warn("Could not fetch full product data:", error)
            }
          }

          const success = addToLocalWishlist(productId, productData, fullProduct)
          if (success) {
            loadLocalWishlist()
            addToast("Product added to wishlist", "success")
          } else {
            addToast("Product is already in wishlist", "info")
          }
        }
      } catch (error) {
        console.error("Error adding to wishlist:", error)
        const errorMessage = error instanceof Error
          ? error.message
          : "Failed to add product to wishlist"
        setError(errorMessage)
        addToast(errorMessage, "error")
        throw error
      }
    },
    [isAuthenticated, lazyLoadWishlist, refreshWishlist, loadLocalWishlist, addToast]
  )

  // Remove product from wishlist
  const removeProduct = useCallback(
    async (productId: string) => {
      try {
        setError(null)

        if (isAuthenticated) {
          // Server-based wishlist for authenticated users
          await lazyLoadWishlist()
          const wishlistItem = wishlistItems.find(
            (item) => item.reference_id === productId
          )
          if (wishlistItem) {
            const success = await removeFromWishlist(wishlistItem.wishlist_id, productId)
            if (success) {
              await refreshWishlist()
              addToast("Product removed from wishlist", "success")
            } else {
              setError("Failed to remove product from wishlist")
              addToast("Failed to remove product from wishlist", "error")
            }
          }
        } else {
          // Local wishlist for non-authenticated users
          const success = removeFromLocalWishlist(productId)
          if (success) {
            loadLocalWishlist()
            addToast("Product removed from wishlist", "success")
          } else {
            addToast("Product not found in wishlist", "info")
          }
        }
      } catch (error) {
        console.error("Error removing from wishlist:", error)
        const errorMessage = error instanceof Error
          ? error.message
          : "Failed to remove product from wishlist"
        setError(errorMessage)
        addToast(errorMessage, "error")
        throw error
      }
    },
    [isAuthenticated, lazyLoadWishlist, wishlistItems, refreshWishlist, loadLocalWishlist, addToast]
  )

  // Clear all wishlist items
  const clearAllItems = useCallback(
    async () => {
      try {
        setError(null)
        setIsLoading(true)

        if (isAuthenticated) {
          // For authenticated users, remove all server wishlist items
          await lazyLoadWishlist()
          const removePromises = wishlistItems.map(item => 
            removeFromWishlist(item.wishlist_id, item.reference_id)
          )
          await Promise.allSettled(removePromises)
          await refreshWishlist()
          addToast("All items removed from wishlist", "success")
        } else {
          // For non-authenticated users, clear local storage
          clearLocalWishlist()
          loadLocalWishlist()
          addToast("All items removed from wishlist", "success")
        }
      } catch (error) {
        console.error("Error clearing wishlist:", error)
        const errorMessage = error instanceof Error
          ? error.message
          : "Failed to clear wishlist"
        setError(errorMessage)
        addToast(errorMessage, "error")
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [isAuthenticated, lazyLoadWishlist, wishlistItems, refreshWishlist, loadLocalWishlist, addToast]
  )

  // Check if product is in wishlist
  const isProductInWishlist = useCallback(
    (productId: string) => {
      if (!hasInitialized) {
        return false
      }

      if (isAuthenticated) {
        return wishlistItems.some((item) => item.reference_id === productId)
      } else {
        return isProductInLocalWishlist(productId)
      }
    },
    [isAuthenticated, wishlistItems, localWishlistItems, hasInitialized]
  )

  // Sync local wishlist to server when user logs in
  const syncLocalToServer = useCallback(async () => {
    if (!isAuthenticated) return

    try {
      setIsLoading(true)
      const localWishlist = getLocalWishlist()
      
      if (localWishlist.items.length > 0) {
        // Add all local items to server wishlist
        const productIds = convertLocalToServerFormat(localWishlist.items)
        const promises = productIds.map((productId) => addToWishlist(productId))
        
        await Promise.allSettled(promises) // Use allSettled to handle partial failures
        
        // Clear local storage after sync
        clearLocalWishlist()
        setLocalWishlistItems([])
        
        // Refresh server wishlist
        await refreshWishlist()
        
        addToast(`Synced ${localWishlist.items.length} items to your account`, "success")
      }
    } catch (error) {
      console.error("Error syncing local wishlist to server:", error)
      addToast("Failed to sync local wishlist", "error")
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, refreshWishlist, addToast])

  // Initialize on mount and when authentication status changes
  useEffect(() => {
    setHasInitialized(false)
    if (isAuthenticated) {
      // User logged in - sync local wishlist if any
      syncLocalToServer()
    } else {
      // User not authenticated - load local wishlist
      loadLocalWishlist()
      setHasInitialized(true)
    }
  }, [isAuthenticated, syncLocalToServer, loadLocalWishlist])

  // Transform local wishlist items to WishlistItem format
  const transformedLocalItems: WishlistItem[] = useMemo(() => {
    return localWishlistItems.map(localItem => ({
      id: localItem.id,
      wishlist_id: "local",
      reference: "product" as const,
      reference_id: localItem.productId,
      created_at: localItem.addedAt,
      updated_at: localItem.addedAt,
      // Use stored product data if available
      product: localItem.fullProduct ? {
        id: localItem.fullProduct.id,
        title: localItem.fullProduct.title || "Unknown Product",
        handle: localItem.fullProduct.handle || "",
        thumbnail: localItem.fullProduct.thumbnail || undefined,
        description: localItem.fullProduct.description || undefined,
        variants: localItem.fullProduct.variants || undefined,
      } : {
        id: localItem.productId,
        title: localItem.productData?.title || "Unknown Product",
        handle: localItem.productData?.handle || "",
        thumbnail: localItem.productData?.thumbnail,
        description: undefined,
        variants: undefined,
      }
    }))
  }, [localWishlistItems])

  // Calculate total wishlist count
  const wishlistCount = isAuthenticated 
    ? wishlistItems.length 
    : localWishlistItems.length

  const value: WishlistContextType = {
    wishlistItems: isAuthenticated ? wishlistItems : transformedLocalItems, // Return transformed local items for non-authenticated users
    isLoading,
    error,
    addProduct,
    removeProduct,
    clearAllItems,
    isProductInWishlist,
    refreshWishlist,
    lazyLoadWishlist,
    wishlistCount,
    clearError,
    syncLocalToServer,
    isAuthenticated,
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

// Export the hybrid provider as the default
export const WishlistProvider = HybridWishlistProvider
