import {
  CheckCircleSolid,
  ExclamationCircleSolid,
  InformationCircleSolid,
  BuildingStorefront,
  CheckMini,
} from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"

const ProductFacts = ({ product }: { product: HttpTypes.StoreProduct }) => {
  const inventoryQuantity =
    product.variants?.reduce(
      (acc, variant) => acc + (variant.inventory_quantity ?? 0),
      0
    ) || 0

  // Calculate total bundle units if product has bundle variants
  const totalBundleUnits =
    product.variants?.reduce((acc, variant) => {
      const bundleQty = variant.metadata?.bundle_quantity
        ? parseInt(variant.metadata.bundle_quantity.toString())
        : 1
      const inventory = variant.inventory_quantity ?? 0
      return acc + inventory * bundleQty
    }, 0) || 0

  const hasBundles =
    product.variants?.some(
      (variant) =>
        variant.metadata?.bundle_quantity &&
        parseInt(variant.metadata.bundle_quantity.toString()) > 1
    ) || false

  return (
    <div className="flex flex-col gap-y-3 w-full">
      {/* Stock Status */}
      <div className="flex items-start gap-x-3">
        {inventoryQuantity > 10 ? (
          <CheckCircleSolid className="text-green-500 mt-0.5 flex-shrink-0" />
        ) : (
          <ExclamationCircleSolid className="text-orange-500 mt-0.5 flex-shrink-0" />
        )}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-ui-fg-base">
            {inventoryQuantity > 10 ? "In Stock" : "Limited Stock"}
          </span>
          <span className="text-xs text-ui-fg-subtle">
            {/* Exact stock quantities commented out for now */}
            {/* {inventoryQuantity} variant{inventoryQuantity !== 1 ? "s" : ""}{" "}
            available
            {hasBundles && totalBundleUnits > inventoryQuantity && (
              <span> ({totalBundleUnits} total units)</span>
            )} */}
            Multiple variants available
          </span>
        </div>
      </div>

      {/* Shipping Information */}
      <div className="flex items-start gap-x-3">
        <BuildingStorefront className="text-blue-500 mt-0.5 flex-shrink-0" />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-ui-fg-base">
            Fast Shipping
          </span>
          <span className="text-xs text-ui-fg-subtle">
            {inventoryQuantity > 10
              ? "Can be shipped immediately"
              : "Ships within 2-3 business days"}
          </span>
        </div>
      </div>

      {/* Product Code */}
      {product.mid_code && (
        <div className="flex items-start gap-x-3">
          <InformationCircleSolid className="text-gray-500 mt-0.5 flex-shrink-0" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-ui-fg-base">
              Product Code
            </span>
            <span className="text-xs text-ui-fg-subtle font-mono">
              {product.mid_code}
            </span>
          </div>
        </div>
      )}

      {/* Quality Assurance */}
      <div className="flex items-start gap-x-3">
        <CheckMini className="text-green-500 mt-0.5 flex-shrink-0" />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-ui-fg-base">
            Quality Assured
          </span>
          <span className="text-xs text-ui-fg-subtle">
            Verified by Thread Buy quality standards
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProductFacts
