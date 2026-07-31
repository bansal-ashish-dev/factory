"use client"

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react"
import {
  WishlistItem,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "@lib/data/wishlist"
import { useToast } from "./toast-provider"

interface WishlistContextType {
  wishlistItems: WishlistItem[]
  isLoading: boolean
  error: string | null
  addProduct: (productId: string) => Promise<void>
  removeProduct: (productId: string) => Promise<void>
  isProductInWishlist: (productId: string) => boolean
  refreshWishlist: () => Promise<void>
  lazyLoadWishlist: () => Promise<void>
  wishlistCount: number
  clearError: () => void
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
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({
  children,
}) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastFetchTime, setLastFetchTime] = useState<number>(0)
  const [hasInitialized, setHasInitialized] = useState(false)
  const [loadingPromise, setLoadingPromise] = useState<Promise<void> | null>(
    null
  )
  const { addToast } = useToast()

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const refreshWishlist = useCallback(async () => {
    const now = Date.now()
    // Debounce API calls - don't fetch more than once per second
    if (now - lastFetchTime < 1000) {
      return
    }

    try {
      setIsLoading(true)
      setError(null) // Clear previous errors
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
  }, [lastFetchTime])

  // Lazy load wishlist - only load when explicitly requested
  const lazyLoadWishlist = useCallback(async () => {
    if (hasInitialized) {
      return
    }

    // If already loading, wait for the existing promise
    if (loadingPromise) {
      return loadingPromise
    }

    const promise = (async () => {
      setHasInitialized(true)

      await refreshWishlist()
    })()

    setLoadingPromise(promise)

    try {
      await promise
    } finally {
      setLoadingPromise(null)
    }
  }, [hasInitialized, refreshWishlist, loadingPromise])

  const addProduct = useCallback(
    async (productId: string) => {
      try {
        setError(null) // Clear previous errors
        await lazyLoadWishlist() // Ensure wishlist is loaded
        
        // Check if product is already in wishlist
        const existingItem = wishlistItems.find(item => item.reference_id === productId)
        if (existingItem) {
          addToast("Product is already in wishlist!", "info")
          return
        }
        
        const success = await addToWishlist(productId)
        if (success) {
          await refreshWishlist() // Get fresh data from server
          addToast("Product added to wishlist!", "success")
        } else {
          setError("Failed to add product to wishlist")
          addToast("Failed to add product to wishlist", "error")
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
    [lazyLoadWishlist, refreshWishlist, addToast, wishlistItems]
  )

  const removeProduct = useCallback(
    async (productId: string) => {
      try {
        setError(null) // Clear previous errors
        await lazyLoadWishlist() // Ensure wishlist is loaded
        
        // Find the wishlist item to get the actual wishlist entry ID
        const wishlistItem = wishlistItems.find(
          (item) => item.reference_id === productId
        )
        if (wishlistItem) {
          // Use the wishlist_id which is the actual backend wishlist entry ID
          const success = await removeFromWishlist(wishlistItem.wishlist_id, productId)
          if (success) {
            await refreshWishlist() // Get fresh data from server
            addToast("Product removed from wishlist", "success")
          } else {
            setError("Failed to remove product from wishlist")
            addToast("Failed to remove product from wishlist", "error")
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
    [lazyLoadWishlist, wishlistItems, refreshWishlist, addToast]
  )

  const isProductInWishlist = useCallback(
    (productId: string) => {
      // Don't trigger lazy load during render - this causes React errors
      // Components should call lazyLoadWishlist() explicitly when needed
      if (!hasInitialized) {
        return false // Return false when not initialized yet
      }
      return wishlistItems.some((item) => item.reference_id === productId)
    },
    [wishlistItems, hasInitialized]
  )

  // Only initialize when component mounts, but don't load data immediately
  // Removed unnecessary useEffect

  const value: WishlistContextType = {
    wishlistItems,
    isLoading,
    error,
    addProduct,
    removeProduct,
    isProductInWishlist,
    refreshWishlist,
    lazyLoadWishlist,
    wishlistCount: wishlistItems.length,
    clearError,
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}
