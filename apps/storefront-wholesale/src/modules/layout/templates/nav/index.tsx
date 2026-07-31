import { Suspense } from "react"
import Image from "next/image"
import { Heart, User } from "lucide-react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SkeletonMegaMenu from "@modules/skeletons/components/skeleton-mega-menu"
import SkeletonBrandsMenu from "@modules/skeletons/components/skeleton-brands-menu"
import MegaMenuWrapper from "@modules/layout/components/mega-menu"
import BrandsMenuWrapper from "@modules/layout/components/brands-menu"
import SkeletonCartButton from "@modules/skeletons/components/skeleton-cart-button"
import WishlistNavLink from "@modules/layout/components/wishlist-nav-link"
import SideMenu from "@modules/layout/components/side-menu"
import SellerLogo from "../../../../components/seller-logo"
import { retrieveCustomer } from "@lib/data/customer"
import { listRegions } from "@lib/data/regions"

export default async function Nav() {
  const customer = await retrieveCustomer().catch(() => null)
  const regions = await listRegions().catch(() => [])
  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-18 mx-auto border-b duration-200 bg-white border-ui-border-base">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
          <div className="flex items-center h-full">
            <div className="small:hidden">
              <SideMenu regions={regions} />
            </div>
            <LocalizedClientLink
              href="/"
              className="hidden small:flex items-center gap-x-3 hover:opacity-80 transition-opacity"
              data-testid="nav-store-link"
            >
              <SellerLogo
                width={192}
                height={48}
                className="h-12 w-48"
                fallbackSrc="/images/logo.svg"
                fallbackAlt="Thread Buy"
              />
            </LocalizedClientLink>
          </div>

          {/* Mobile centered logo */}
          <div className="small:hidden absolute left-1/2 transform -translate-x-1/2 max-w-[calc(100vw-120px)]">
            <LocalizedClientLink
              href="/"
              className="flex items-center gap-x-3 hover:opacity-80 transition-opacity"
              data-testid="nav-store-link-mobile"
            >
              <SellerLogo
                width={150}
                height={32}
                className="h-8 w-auto max-w-[150px]"
                fallbackSrc="/images/logo.svg"
                fallbackAlt="Thread Buy"
              />
            </LocalizedClientLink>
          </div>

          <div className="flex-1 basis-0 h-full flex justify-center">
            <ul className="hidden small:flex items-center gap-x-6">
              <li>
                <LocalizedClientLink
                  href="/store"
                  className="hover:text-ui-fg-base text-ui-fg-subtle"
                >
                  Store
                </LocalizedClientLink>
              </li>
              <li>
                <Suspense fallback={<SkeletonMegaMenu />}>
                  <MegaMenuWrapper />
                </Suspense>
              </li>
              <li>
                <Suspense fallback={<SkeletonBrandsMenu />}>
                  <BrandsMenuWrapper />
                </Suspense>
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-x-4 h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-x-4 h-full">
              <LocalizedClientLink
                className="hover:text-ui-fg-base"
                href="/account"
                data-testid="nav-account-link"
              >
                <User className="h-5 w-5" />
              </LocalizedClientLink>
              <WishlistNavLink />
            </div>

            <Suspense fallback={<SkeletonCartButton />}>
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
