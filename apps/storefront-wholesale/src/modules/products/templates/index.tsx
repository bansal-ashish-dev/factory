import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import ProductBrandSellerInfo from "@modules/products/components/product-brand-seller-info"
import { notFound } from "next/navigation"
import ProductActionsWrapper from "./product-actions-wrapper"
import ProductFacts from "../components/product-facts"
import { HttpTypes } from "@medusajs/types"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  brandProducts?: HttpTypes.StoreProduct[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  brandProducts,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <>
      {/* Main Product Section */}
      <div
        className="content-container py-4 md:py-6"
        data-testid="product-container"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Left Column - Image Gallery */}
          <div className="relative order-1 lg:order-1">
            <ImageGallery product={product} />
          </div>

          {/* Right Column - Product Details */}
          <div className="flex flex-col gap-4 lg:gap-6 order-2 lg:order-2">
            {/* Main Product Info Card */}
            <div className="bg-white border border-neutral-200 rounded-lg p-4 md:p-6 lg:p-8 shadow-sm">
              <ProductInfo product={product} />
              <div className="mt-6 lg:mt-8">
                <Suspense
                  fallback={
                    <ProductActions product={product} region={region} />
                  }
                >
                  <ProductActionsWrapper product={product} region={region} />
                </Suspense>
              </div>
            </div>

            {/* Product Facts - Mobile Optimized */}
            <div className="bg-white border border-neutral-200 rounded-lg p-4 md:p-6 lg:p-8 shadow-sm">
              <ProductFacts product={product} />
            </div>

            {/* Product Tabs - Mobile Optimized */}
            {/* <div className="bg-white border border-neutral-200 rounded-lg p-4 md:p-6 lg:p-8 shadow-sm">
              <ProductTabs product={product} />
            </div> */}

            {/* Brand and Seller Information */}
            <ProductBrandSellerInfo
              product={product}
              region={region}
              countryCode={countryCode}
              brandProducts={brandProducts}
            />
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div
        className="content-container my-12 md:my-16 lg:my-32"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
