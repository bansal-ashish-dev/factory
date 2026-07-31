import { Suspense } from "react"
import dynamic from "next/dynamic"
import { TrendingProductsSkeleton } from "./trending-products-skeleton"

// Dynamic import for trending products to reduce initial bundle size
const TrendingProductsDynamic = dynamic(() => import("./index"), {
  loading: () => <TrendingProductsSkeleton />,
  ssr: true, // Keep server-side rendering for SEO
})

interface TrendingProductsWrapperProps {
  countryCode: string
}

export default function TrendingProductsWrapper({
  countryCode,
}: TrendingProductsWrapperProps) {
  return (
    <Suspense fallback={<TrendingProductsSkeleton />}>
      <TrendingProductsDynamic countryCode={countryCode} />
    </Suspense>
  )
}
