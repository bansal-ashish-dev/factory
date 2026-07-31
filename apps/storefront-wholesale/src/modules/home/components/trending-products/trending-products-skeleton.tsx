export const TrendingProductsSkeleton = () => {
  return (
    <div
      className="content-container py-12"
      data-testid="trending-products-skeleton"
    >
      <div className="text-center mb-8">
        <p className="text-sm text-ui-fg-subtle">
          Loading trending products...
        </p>
      </div>
      {/* Top Selling Section Skeleton */}
      <div className="mb-16">
        <div className="mb-8 text-center">
          <div className="h-8 w-64 bg-ui-bg-subtle rounded mx-auto mb-2 animate-pulse" />
          <div className="h-5 w-48 bg-ui-bg-subtle rounded mx-auto animate-pulse" />
        </div>
        <div className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-3 large:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-square bg-ui-bg-subtle rounded-lg mb-4" />
              <div className="h-5 bg-ui-bg-subtle rounded mb-2" />
              <div className="h-4 bg-ui-bg-subtle rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>

      {/* New Products Section Skeleton */}
      <div>
        <div className="mb-8 text-center">
          <div className="h-8 w-48 bg-ui-bg-subtle rounded mx-auto mb-2 animate-pulse" />
          <div className="h-5 w-56 bg-ui-bg-subtle rounded mx-auto animate-pulse" />
        </div>
        <div className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-3 large:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-square bg-ui-bg-subtle rounded-lg mb-4" />
              <div className="h-5 bg-ui-bg-subtle rounded mb-2" />
              <div className="h-4 bg-ui-bg-subtle rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
