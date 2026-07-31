"use client"

import { Heart } from "lucide-react"
import { useWishlist } from "@providers/hybrid-wishlist-provider"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useEffect } from "react"

const WishlistNavLink = () => {
  const { wishlistCount, lazyLoadWishlist } = useWishlist()

  // Load wishlist count when component mounts (for navigation)
  useEffect(() => {
    lazyLoadWishlist()
  }, [lazyLoadWishlist])

  return (
    <LocalizedClientLink
      className="hover:text-ui-fg-base flex items-center gap-x-1 relative"
      href="/wishlist"
      data-testid="nav-wishlist-link"
    >
      <div className="relative">
        <Heart className="w-5 h-5" />
        {wishlistCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] font-medium">
            {wishlistCount > 99 ? "99+" : wishlistCount}
          </span>
        )}
      </div>
    </LocalizedClientLink>
  )
}

export default WishlistNavLink
