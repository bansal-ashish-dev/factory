"use client"

import { clx } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { StoreBrand } from "@lib/data/brands"
import BrandLogo from "../../../../components/brand-logo"

const BrandsMenu = ({
  brands,
}: {
  brands: StoreBrand[]
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const pathname = usePathname()

  // Filter brands that have valid data
  const validBrands = useCallback(() => {
    return brands.filter(brand => brand && brand.name)
  }, [brands])

  const filteredBrands = validBrands()

  let menuTimeout: NodeJS.Timeout | null = null

  const handleMenuHover = () => {
    if (menuTimeout) {
      clearTimeout(menuTimeout)
    }
    setIsHovered(true)
  }

  const handleMenuLeave = () => {
    menuTimeout = setTimeout(() => {
      setIsHovered(false)
    }, 300)

    return () => {
      if (menuTimeout) {
        clearTimeout(menuTimeout)
      }
    }
  }

  useEffect(() => {
    setIsHovered(false)
  }, [pathname])

  return (
    <>
      {filteredBrands.length > 0 && (
        <div
          onMouseEnter={handleMenuHover}
          onMouseLeave={handleMenuLeave}
          className="z-50"
        >
          <LocalizedClientLink
            className="hover:text-ui-fg-base hover:bg-neutral-100 rounded-full px-3 py-2 transition-colors"
            href="/brands"
          >
            Brands
          </LocalizedClientLink>
          {isHovered && (
            <div className="fixed left-0 right-0 top-[60px] flex gap-8 py-8 px-20 bg-white border-b border-neutral-200 shadow-lg max-h-[400px] overflow-y-auto">
              {filteredBrands.length > 0 ? (
                <div className="grid grid-cols-6 gap-8 w-full">
                  {filteredBrands.map((brand) => (
                    <LocalizedClientLink
                      key={brand.id}
                      href={`/brands/${brand.handle || brand.id}`}
                      className="flex flex-col items-center gap-3 hover:bg-neutral-50 rounded-lg p-4 transition-colors group"
                    >
                      <BrandLogo
                        src={brand.thumbnail}
                        alt={brand.name}
                        size="medium"
                        variant="circle"
                        className="group-hover:scale-105 transition-transform"
                      />
                      <div className="text-center">
                        <h3 className="font-medium text-sm text-neutral-900 group-hover:text-neutral-700">
                          {brand.name}
                        </h3>
                        {brand.description && (
                          <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                            {brand.description}
                          </p>
                        )}
                      </div>
                    </LocalizedClientLink>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center w-full py-8">
                  <div className="text-center">
                    <span className="text-neutral-400 font-medium">
                      No brands available
                    </span>
                    <p className="text-xs text-neutral-300 mt-2">
                      Check back later for new brands
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {isHovered && filteredBrands.length > 0 && (
        <div className="fixed inset-0 mt-[60px] blur-sm backdrop-blur-sm z-[-1]" />
      )}
    </>
  )
}

export default BrandsMenu
