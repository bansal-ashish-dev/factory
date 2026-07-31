import { Metadata } from "next"
import { Suspense } from "react"

import Hero from "@modules/home/components/hero"
import Brands from "@modules/home/components/brands"
import DressStyle from "@modules/home/components/dress-style"
import Reviews from "@modules/home/components/reviews"
import TrendingProducts from "@modules/home/components/trending-products"
import { TrendingProductsSkeleton } from "@modules/home/components/trending-products/trending-products-skeleton"
import { listBrands } from "@lib/data/brands"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Thread Buy",
  description:
    "A performant frontend ecommerce starter template for Thread Buy.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params

  // Fetch brands and region in parallel for faster loading
  const [brands, region] = await Promise.allSettled([
    listBrands({ limit: 100 }), // Fetch all brands for the flowing banner
    getRegion(countryCode),
  ])

  const brandsData = brands.status === "fulfilled" ? brands.value : []
  const regionData = region.status === "fulfilled" ? region.value : null

  return (
    <>
      <Hero />
      <Brands brands={brandsData} />
      <main className="my-12 lg:my-16">
        <div className="mb-12 lg:mb-16">
          <DressStyle />
        </div>

        {/* Trending Products Section - Only render if region is available */}
        {regionData && (
          <div className="mb-12 lg:mb-16">
            <Suspense fallback={<TrendingProductsSkeleton />}>
              <TrendingProducts countryCode={countryCode} />
            </Suspense>
          </div>
        )}

        <Reviews />
      </main>
    </>
  )
}
