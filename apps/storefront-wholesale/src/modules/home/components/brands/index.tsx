"use client"

import { StoreBrand } from "@lib/data/brands"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import BrandLogo from "components/brand-logo"
import { useEffect, useRef } from "react"

type BrandsProps = {
  brands?: StoreBrand[]
}

const Brands = ({ brands = [] }: BrandsProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  if (brands.length === 0) {
    return null
  }

  // Duplicate brands for seamless infinite scroll
  const duplicatedBrands = [...brands, ...brands, ...brands]

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    let animationId: number
    let scrollPosition = 0
    const scrollSpeed = 0.5 // pixels per frame

    const animate = () => {
      scrollPosition += scrollSpeed

      // Reset position when we've scrolled through one set of brands
      if (scrollPosition >= container.scrollWidth / 3) {
        scrollPosition = 0
      }

      container.scrollLeft = scrollPosition
      animationId = requestAnimationFrame(animate)
    }

    // Start animation
    animationId = requestAnimationFrame(animate)

    // Pause on hover
    const handleMouseEnter = () => {
      cancelAnimationFrame(animationId)
    }

    const handleMouseLeave = () => {
      animationId = requestAnimationFrame(animate)
    }

    container.addEventListener("mouseenter", handleMouseEnter)
    container.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      cancelAnimationFrame(animationId)
      container.removeEventListener("mouseenter", handleMouseEnter)
      container.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 py-8 md:py-12 overflow-hidden">
      <div className="relative">
        {/* Gradient overlays for smooth edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none" />

        {/* Flowing brands banner */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-8 md:gap-12 overflow-x-hidden no-scrollbar"
        >
          {duplicatedBrands.map((brand, index) => (
            <LocalizedClientLink
              key={`${brand.id}-${index}`}
              href={`/brands/${brand.handle}`}
              className="flex-shrink-0 group transition-all duration-300 hover:scale-110"
            >
              <div className="flex flex-col items-center gap-2 md:gap-3">
                {brand.thumbnail ? (
                  <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 group-hover:border-white/40 transition-all duration-300">
                    <BrandLogo
                      src={brand.thumbnail}
                      alt={brand.name.toLocaleUpperCase()}
                      size="large"
                      variant="square"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 group-hover:border-white/40 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white font-bold text-xs md:text-sm lg:text-base text-center">
                      {brand.name.toUpperCase().slice(0, 3)}
                    </span>
                  </div>
                )}
                <span className="text-white/80 text-xs md:text-sm font-medium tracking-wide group-hover:text-white transition-colors duration-300 text-center">
                  {brand.name.toUpperCase()}
                </span>
              </div>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Brands
