import { getTrendingProducts } from "@lib/data/trending-products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { HorizontalScrollSection } from "./horizontal-scroll-section"

type TrendingProductsProps = {
  countryCode: string
}

export default async function TrendingProducts({
  countryCode,
}: TrendingProductsProps) {
  const trendingData = await getTrendingProducts({ countryCode })
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const { top_selling = [], new_products = [] } = trendingData || {}

  // Always show something for debugging
  if ((top_selling?.length || 0) === 0 && (new_products?.length || 0) === 0) {
    return (
      <div
        className="content-container py-12"
        data-testid="trending-products-empty"
      >
        <div className="text-center">
          <h2 className="txt-xlarge font-bold text-ui-fg-base mb-2">
            No Trending Products Found
          </h2>
          <p className="txt-medium text-ui-fg-subtle">
            This indicates an issue with the data fetching or filtering
          </p>
          <div className="mt-4 text-xs text-ui-fg-muted">
            Debug: countryCode={countryCode}, region={region?.id}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="content-container py-12">
      {/* Top Selling Section */}
      {top_selling.length > 0 && (
        <div className="mb-16">
          <HorizontalScrollSection
            title="Top Selling Products"
            subtitle="Discover our most popular items"
            scrollId="top-selling-scroll"
          >
            {top_selling.map((product) => (
              <div
                key={product.id}
                className="flex-none w-[240px] sm:w-[280px] small:w-[320px]"
              >
                <ProductPreview
                  product={product}
                  region={region}
                  isFeatured={false}
                />
              </div>
            ))}
          </HorizontalScrollSection>
        </div>
      )}

      {/* New Products Section */}
      {new_products.length > 0 && (
        <div>
          <HorizontalScrollSection
            title="New Arrivals"
            subtitle="Check out our latest products"
            scrollId="new-arrivals-scroll"
          >
            {new_products.map((product) => (
              <div
                key={product.id}
                className="flex-none w-[240px] sm:w-[280px] small:w-[320px]"
              >
                <ProductPreview
                  product={product}
                  region={region}
                  isFeatured={false}
                />
              </div>
            ))}
          </HorizontalScrollSection>
        </div>
      )}
    </div>
  )
}
