import repeat from "@lib/util/repeat"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"

const SkeletonProductGrid = ({ count = 10 }: { count?: number }) => {
  const countToRender = Math.min(count, 10)

  return (
    <ul
      className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-5 gap-4 flex-1"
      data-testid="products-list-loader"
    >
      {repeat(countToRender).map((index) => (
        <li key={index}>
          <SkeletonProductPreview />
        </li>
      ))}
    </ul>
  )
}

export default SkeletonProductGrid
