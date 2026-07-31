"use client"

import { Button } from "@medusajs/ui"
import { Heart } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { useWishlist } from "@providers/hybrid-wishlist-provider"
import { getCountryCodeFromUrl } from "@lib/get-country-code"

interface WishlistButtonProps {
  productId: string
  variant?: "primary" | "secondary" | "transparent" | "danger"
  size?: "small" | "base" | "large"
  className?: string
  showText?: boolean
  // Optional product data to store with local wishlist
  productData?: {
    title?: string
    handle?: string
    thumbnail?: string
    price?: string
  }
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({
  productId,
  variant = "secondary",
  size = "base",
  className = "",
  showText = false,
  productData,
}) => {
  const { addProduct, removeProduct, isProductInWishlist, isLoading, error, clearError, lazyLoadWishlist } = useWishlist()
  const [isToggling, setIsToggling] = useState(false)
  const [hasTriggeredLoad, setHasTriggeredLoad] = useState(false)
  const [justToggled, setJustToggled] = useState(false)
  
  const inWishlist = isProductInWishlist(productId)

  // Only trigger lazy load on first user interaction or when component becomes visible
  const triggerLazyLoadOnce = useCallback(() => {
    if (!hasTriggeredLoad) {
      setHasTriggeredLoad(true)
      lazyLoadWishlist()
    }
  }, [hasTriggeredLoad, lazyLoadWishlist])

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isToggling || isLoading) return

    // Ensure wishlist is loaded before toggle
    triggerLazyLoadOnce()

    // Clear any previous errors
    if (error) {
      clearError()
    }

    setIsToggling(true)
    
    try {
      if (inWishlist) {
        await removeProduct(productId)
      } else {
        // Pass country code and basic product data for local storage
        const countryCode = getCountryCodeFromUrl()
        await addProduct(productId, { 
          countryCode,
          ...productData, // Merge any passed product data
        })
      }
      
      // Small visual feedback delay
      setJustToggled(true)
      setTimeout(() => setJustToggled(false), 200)
      
    } catch (error) {
      console.error("Error toggling wishlist:", error)
      // Error is now handled by the provider
    } finally {
      setIsToggling(false)
    }
  }

  return (
    <Button
      onClick={handleToggle}
      onMouseEnter={triggerLazyLoadOnce} // Load wishlist on hover for better UX
      variant={variant}
      size={size}
      disabled={isToggling || isLoading}
      className={`${className} transition-colors duration-200 ${
        inWishlist 
          ? "text-red-500 hover:text-red-600" 
          : "text-ui-fg-subtle hover:text-red-400"
      } ${justToggled ? "scale-105" : ""}`}
    >
      <Heart 
        className={`w-4 h-4 transition-all duration-200 ${
          inWishlist ? "fill-red-500 text-red-500" : ""
        } ${isToggling ? "animate-pulse" : ""}`} 
      />
      {showText && (
        <span className="ml-2">
          {isToggling 
            ? (inWishlist ? "Removing..." : "Adding...") 
            : (inWishlist ? "Remove from Wishlist" : "Add to Wishlist")
          }
        </span>
      )}
    </Button>
  )
}
