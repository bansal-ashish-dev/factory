import { listCategoriesWithProductCount } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { listBrands } from "@lib/data/brands"
import { Text, clx } from "@medusajs/ui"
import {
  Phone,
  Mail,
  MapPin,
  Youtube,
  ExternalLink,
  Building2,
  Users,
  ShoppingBag,
  Shield,
  FileText,
} from "lucide-react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MedusaCTA from "@modules/layout/components/medusa-cta"
import SellerLogo from "components/seller-logo"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategoriesWithProductCount({ limit: 50 })
  const brands = await listBrands({ limit: 100 }).catch(() => [])

  const capitalizeBrandName = (name: string) => {
    return name
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <footer className="bg-ui-bg-subtle border-t border-ui-border-base w-full">
      <div className="content-container flex flex-col w-full">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <LocalizedClientLink
                href="/"
                className="flex items-center gap-x-2 mb-6"
              >
                <SellerLogo
                  width={192}
                  height={48}
                  className="h-12 w-48"
                  fallbackSrc="/images/logo.svg"
                  fallbackAlt="Thread Buy"
                />
              </LocalizedClientLink>
              <Text className="text-ui-fg-subtle text-sm leading-relaxed mb-6">
                India's leading B2B fashion marketplace connecting retailers
                with premium brands and manufacturers.
              </Text>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-ui-fg-muted" />
                  <a
                    href="tel:+919782077711"
                    className="text-ui-fg-subtle hover:text-ui-fg-base text-sm transition-colors"
                  >
                    +91 9782077711
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-ui-fg-muted" />
                  <a
                    href="mailto:info@threadbuy.com"
                    className="text-ui-fg-subtle hover:text-ui-fg-base text-sm transition-colors"
                  >
                    info@threadbuy.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-ui-fg-muted" />
                  <span className="text-ui-fg-subtle text-sm">
                    Rajasthan, India
                  </span>
                </div>
              </div>
            </div>
            {/* Categories Section */}
            {productCategories && productCategories?.length > 0 && (
              <div className="flex flex-col gap-y-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-ui-fg-muted" />
                  <span className="text-base font-semibold text-ui-fg-base">
                    Categories
                  </span>
                </div>
                <ul
                  className="grid grid-cols-1 gap-2"
                  data-testid="footer-categories"
                >
                  {productCategories?.slice(0, 6).map((c) => {
                    if (c.parent_category) {
                      return
                    }

                    // Get child categories (already filtered by API)
                    const childrenWithProducts =
                      c.category_children
                        ?.filter((child: any) => {
                          const childCategory = productCategories.find(
                            (cat: any) => cat.id === child.id
                          )
                          return childCategory
                        })
                        .map((child: any) => ({
                          name: child.name,
                          handle: child.handle,
                          id: child.id,
                        })) || null

                    return (
                      <li
                        className="flex flex-col gap-2 text-ui-fg-subtle txt-small"
                        key={c.id}
                      >
                        <LocalizedClientLink
                          className={clx(
                            "hover:text-ui-fg-base transition-colors text-sm",
                            childrenWithProducts &&
                              childrenWithProducts.length > 0 &&
                              "font-medium"
                          )}
                          href={`/categories/${c.handle}`}
                          data-testid="category-link"
                        >
                          {c.name}
                        </LocalizedClientLink>
                        {childrenWithProducts &&
                          childrenWithProducts.length > 0 && (
                            <ul className="grid grid-cols-1 ml-3 gap-2">
                              {childrenWithProducts.map((child) => (
                                <li key={child.id}>
                                  <LocalizedClientLink
                                    className="hover:text-ui-fg-base transition-colors text-sm"
                                    href={`/categories/${child.handle}`}
                                    data-testid="category-link"
                                  >
                                    {child.name}
                                  </LocalizedClientLink>
                                </li>
                              ))}
                            </ul>
                          )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
            {collections && collections.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="txt-small-plus txt-ui-fg-base">
                  Collections
                </span>
                <ul
                  className={clx(
                    "grid grid-cols-1 gap-2 text-ui-fg-subtle txt-small",
                    {
                      "grid-cols-2": (collections?.length || 0) > 3,
                    }
                  )}
                >
                  {collections?.slice(0, 6).map((c) => (
                    <li key={c.id}>
                      <LocalizedClientLink
                        className="hover:text-ui-fg-base"
                        href={`/collections/${c.handle}`}
                      >
                        {c.title}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Brands Section */}
            {brands && brands.length > 0 && (
              <div className="flex flex-col gap-y-4">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-ui-fg-muted" />
                  <span className="text-base font-semibold text-ui-fg-base">
                    Brands
                  </span>
                </div>
                <ul className="grid grid-cols-1 gap-2">
                  {brands.slice(0, 12).map((brand) => (
                    <li key={brand.id}>
                      <LocalizedClientLink
                        className="hover:text-ui-fg-base transition-colors text-sm text-ui-fg-subtle"
                        href={`/brands/${brand.handle || brand.id}`}
                        data-testid="brand-link"
                      >
                        {capitalizeBrandName(brand.name) || "Brand"}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Company Section */}
            <div className="flex flex-col gap-y-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-ui-fg-muted" />
                <span className="text-base font-semibold text-ui-fg-base">
                  Company
                </span>
              </div>
              <ul className="grid grid-cols-1 gap-3">
                <li>
                  <LocalizedClientLink
                    href="/about"
                    className="hover:text-ui-fg-base transition-colors text-sm text-ui-fg-subtle flex items-center gap-2"
                  >
                    <Users className="w-4 h-4" />
                    About Us
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/contact"
                    className="hover:text-ui-fg-base transition-colors text-sm text-ui-fg-subtle flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Contact
                  </LocalizedClientLink>
                </li>
                <li>
                  <a
                    href="https://vendor.threadbuy.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-ui-fg-base transition-colors text-sm text-ui-fg-subtle flex items-center gap-2 font-medium text-ui-fg-interactive"
                  >
                    <Building2 className="w-4 h-4" />
                    Become a Supplier
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/@thread_buy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-ui-fg-base transition-colors text-sm text-ui-fg-subtle flex items-center gap-2"
                  >
                    <Youtube className="w-4 h-4" />
                    YouTube Channel
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/privacy"
                    className="hover:text-ui-fg-base transition-colors text-sm text-ui-fg-subtle flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    Privacy Policy
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/terms"
                    className="hover:text-ui-fg-base transition-colors text-sm text-ui-fg-subtle flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Terms & Conditions
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-ui-border-base py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Text className="text-sm text-ui-fg-muted">
              © {new Date().getFullYear()} Thread Buy. All rights reserved.
            </Text>
            <div className="flex items-center gap-4">
              <MedusaCTA />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
