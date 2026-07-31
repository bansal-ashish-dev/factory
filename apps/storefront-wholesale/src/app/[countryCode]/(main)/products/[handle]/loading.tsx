import React from "react"

const ProductPageSkeleton = () => {
  return (
    <div className="content-container py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery Skeleton */}
        <div className="relative">
          <div className="aspect-square w-full bg-gray-200 rounded-xl animate-pulse" />
          <div className="flex gap-3 mt-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Product Details Skeleton */}
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-neutral-200 rounded-lg p-6 lg:p-8 shadow-sm">
            {/* Product Title */}
            <div className="h-8 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4 mb-6" />

            {/* Price */}
            <div className="h-10 bg-gray-200 rounded animate-pulse mb-6" />

            {/* Description */}
            <div className="space-y-2 mb-6">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
            </div>

            {/* Size Selection */}
            <div className="mb-4">
              <div className="h-5 bg-gray-200 rounded animate-pulse mb-3" />
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-12 h-10 bg-gray-200 rounded animate-pulse"
                  />
                ))}
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="h-12 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Product Facts Skeleton */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6 lg:p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-1" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPageSkeleton
