"use client"

import { HttpTypes } from "@medusajs/types"
import { Badge, Heading, Text } from "@medusajs/ui"
import { Building2, Store, ArrowRight } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MoreFromBrand from "@modules/products/components/more-from-brand"
import MoreFromSeller from "@modules/products/components/more-from-seller"
import BrandLogo from "../../../../components/brand-logo"
import SellerLogo from "../../../../components/seller-logo-display"

type ProductBrandSellerInfoProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  brandProducts?: HttpTypes.StoreProduct[]
}

const ProductBrandSellerInfo = ({ 
  product, 
  region, 
  countryCode,
  brandProducts
}: ProductBrandSellerInfoProps) => {
  const brand = (product as any).brand
  const seller = (product as any).seller

  return (
    <div className="space-y-12">
      {/* Brand and Seller Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Brand Information */}
        {brand && (
          <div className="bg-ui-bg-subtle rounded-lg p-6 border border-ui-border-base">
            <div className="flex items-start gap-4">
              <BrandLogo
                src={brand.thumbnail}
                alt={brand.name}
                size="medium"
                variant="square"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge size="small" className="bg-ui-bg-base text-ui-fg-subtle">
                    Brand
                  </Badge>
                </div>
                <Heading level="h3" className="text-lg font-semibold mb-2">
                  {brand.name}
                </Heading>
                {brand.description && (
                  <Text className="text-ui-fg-subtle text-sm leading-relaxed mb-4 line-clamp-3">
                    {brand.description}
                  </Text>
                )}
                <LocalizedClientLink
                  href={`/brands/${brand.handle || brand.id}`}
                  className="inline-flex items-center gap-2 text-ui-fg-interactive hover:text-ui-fg-interactive-hover transition-colors text-sm font-medium"
                >
                  <span>View all products</span>
                  <ArrowRight className="w-4 h-4" />
                </LocalizedClientLink>
              </div>
            </div>
          </div>
        )}

        {/* Seller Information */}
        {seller && (
          <div className="bg-ui-bg-subtle rounded-lg p-6 border border-ui-border-base">
            <div className="flex items-start gap-4">
              <SellerLogo
                src={seller.logo}
                alt={seller.company_name || seller.name}
                size="medium"
                variant="square"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge size="small" className="bg-ui-bg-base text-ui-fg-subtle">
                    Seller
                  </Badge>
                </div>
                <Heading level="h3" className="text-lg font-semibold mb-2">
                  {seller.company_name || seller.name}
                </Heading>
                {seller.description && (
                  <Text className="text-ui-fg-subtle text-sm leading-relaxed mb-4 line-clamp-3">
                    {seller.description}
                  </Text>
                )}
                <LocalizedClientLink
                  href={`/sellers/${seller.handle || seller.id}`}
                  className="inline-flex items-center gap-2 text-ui-fg-interactive hover:text-ui-fg-interactive-hover transition-colors text-sm font-medium"
                >
                  <span>View seller profile</span>
                  <ArrowRight className="w-4 h-4" />
                </LocalizedClientLink>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* More from Brand Section */}
      {brand && (
        <MoreFromBrand
          brand={brand}
          brandProducts={brandProducts}
          currentProductId={product.id}
          region={region}
          countryCode={countryCode}
        />
      )}

      {/* More from Seller Section */}
      {seller && (
        <MoreFromSeller
          seller={seller}
          currentProductId={product.id}
          region={region}
          countryCode={countryCode}
        />
      )}
    </div>
  )
}

export default ProductBrandSellerInfo
