import { addToCartEventBus } from "@lib/data/cart-event-bus"
import { addToCart } from "@lib/data/cart"
import { getProductPrice } from "@lib/util/get-product-price"

import { HttpTypes, StoreProduct, StoreProductVariant } from "@medusajs/types"
import { clx, Table, Badge } from "@medusajs/ui"

import { useState, useTransition, useMemo } from "react"
import BulkTableQuantity from "../bulk-table-quantity"
import Button from "@modules/common/components/button"
import ShoppingBag from "@modules/common/icons/shopping-bag"

// Helper function to get variant MRP from metadata
const getVariantMRP = (
  variant: HttpTypes.StoreProductVariant
): number | null => {
  const mrp = variant?.metadata?.mrp
  return mrp ? parseFloat(mrp.toString()) : null
}

// Helper function to get bundle quantity from metadata
const getBundleQuantity = (variant: HttpTypes.StoreProductVariant): number => {
  const bundleQty = variant?.metadata?.bundle_quantity
  return bundleQty ? parseInt(bundleQty.toString()) : 1
}

// Helper function to format currency
const formatCurrency = (amount: number, currencyCode = "INR") => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

const ProductVariantsTable = ({
  product,
  region,
}: {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}) => {
  const [isPending, startTransition] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string>
  >({})
  const [lineItemsMap, setLineItemsMap] = useState<
    Map<
      string,
      StoreProductVariant & {
        product: StoreProduct
        quantity: number
      }
    >
  >(new Map())

  // Extract product options and their values from API
  const productOptions = useMemo(() => {
    if (!product.options) return []

    return product.options
      .filter(
        (option) =>
          option.title !== "Default option" &&
          option.title?.toLowerCase() !== "default option"
      )
      .map((option) => ({
        id: option.id,
        title: option.title || "",
        values: Array.from(
          new Set(option.values?.map((v) => v.value) || [])
        ).sort(),
      }))
  }, [product.options])

  // Check if any variant has MRP defined
  const hasMRP = useMemo(() => {
    return (
      product.variants?.some((variant) => getVariantMRP(variant) !== null) ||
      false
    )
  }, [product.variants])

  // Filter variants based on selected filters
  const filteredVariants = useMemo(() => {
    let variants = product.variants || []

    // Apply filters
    Object.entries(selectedFilters).forEach(([optionId, selectedValue]) => {
      if (selectedValue) {
        variants = variants.filter((variant) => {
          const variantOption = variant.options?.find(
            (opt) => opt.option_id === optionId
          )
          return variantOption?.value === selectedValue
        })
      }
    })

    // Sort variants consistently
    return variants.sort((a, b) => {
      // Primary sort by SKU if available
      if (a.sku && b.sku) {
        return a.sku.localeCompare(b.sku)
      }

      // Secondary sort by option values
      for (const option of productOptions) {
        const valueA =
          a.options?.find((opt) => opt.option_id === option.id)?.value || ""
        const valueB =
          b.options?.find((opt) => opt.option_id === option.id)?.value || ""
        if (valueA !== valueB) {
          return valueA.localeCompare(valueB)
        }
      }

      // Final fallback to variant ID
      return a.id.localeCompare(b.id)
    })
  }, [product.variants, selectedFilters, productOptions])

  const handleFilterChange = (optionId: string, value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [optionId]: prev[optionId] === value ? "" : value,
    }))
  }

  const totalQuantity = Array.from(lineItemsMap.values()).reduce(
    (acc, curr) => acc + curr.quantity,
    0
  )

  // Calculate total value
  const totalValue = useMemo(() => {
    return Array.from(lineItemsMap.values()).reduce((total, item) => {
      const { variantPrice } = getProductPrice({
        product,
        variantId: item.id,
      })
      const priceNumber = variantPrice?.calculated_price_number || 0
      const itemTotal =
        typeof priceNumber === "number" ? priceNumber * item.quantity : 0
      return total + itemTotal
    }, 0)
  }, [lineItemsMap, product])

  const handleQuantityChange = (variantId: string, quantity: number) => {
    setLineItemsMap((prev) => {
      const newLineItems = new Map(prev)

      if (!prev.get(variantId)) {
        newLineItems.set(variantId, {
          ...product.variants?.find((v) => v.id === variantId)!,
          product,
          quantity,
        })
      } else {
        newLineItems.set(variantId, {
          ...prev.get(variantId)!,
          quantity,
        })
      }

      return newLineItems
    })
  }

  const handleAddToCart = async () => {
    startTransition(true)

    const lineItems = Array.from(lineItemsMap.entries()).map(
      ([variantId, { quantity, ...variant }]) => {
        const bundleQty = getBundleQuantity(variant)

        return {
          productVariant: {
            ...variant,
          },
          quantity,
        }
      }
    )

    addToCartEventBus.emitCartAdd({
      lineItems,
      regionId: region.id,
    })

    startTransition(false)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Filter Chips */}
      {productOptions.length > 0 && (
        <div className="space-y-4 bg-ui-bg-subtle p-4 rounded-lg">
          {productOptions.map((option) => (
            <div key={option.id} className="flex flex-col gap-3">
              <span className="text-sm font-medium text-ui-fg-base">
                Select {option.title}:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleFilterChange(option.id, "")}
                  className={clx(
                    "px-3 py-2 text-sm rounded-md border transition-all",
                    {
                      "border-blue-500 bg-blue-50 text-blue-700":
                        !selectedFilters[option.id],
                      "border-neutral-200 bg-white text-ui-fg-base hover:border-neutral-300":
                        selectedFilters[option.id],
                    }
                  )}
                >
                  All {option.title}
                </button>
                {option.values.map((value) => (
                  <button
                    key={value}
                    onClick={() => handleFilterChange(option.id, value)}
                    className={clx(
                      "px-3 py-2 text-sm rounded-md border transition-all",
                      {
                        "border-blue-500 bg-blue-50 text-blue-700":
                          selectedFilters[option.id] === value,
                        "border-neutral-200 bg-white text-ui-fg-base hover:border-neutral-300":
                          selectedFilters[option.id] !== value,
                      }
                    )}
                  >
                    {value.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Variants Table */}
      <div className="overflow-x-auto">
        <Table className="w-full rounded-xl overflow-hidden border border-neutral-200">
          <Table.Header className="border-t-0">
            <Table.Row className="bg-neutral-50 border-none hover:!bg-neutral-50">
              {/* Show all option columns in table */}
              {productOptions.map((option) => (
                <Table.HeaderCell
                  key={option.id}
                  className="px-2 sm:px-4 py-3 border-x font-semibold text-ui-fg-base text-xs sm:text-sm"
                >
                  {option.title.toUpperCase()}
                </Table.HeaderCell>
              ))}
              <Table.HeaderCell className="px-2 sm:px-4 py-3 border-x font-semibold text-ui-fg-base text-xs sm:text-sm">
                PCS
              </Table.HeaderCell>
              {hasMRP && (
                <Table.HeaderCell className="px-2 sm:px-4 py-3 border-x font-semibold text-ui-fg-base text-xs sm:text-sm">
                  MRP
                </Table.HeaderCell>
              )}
              <Table.HeaderCell className="px-2 sm:px-4 py-3 border-x font-semibold text-ui-fg-base text-xs sm:text-sm">
                PRICE
              </Table.HeaderCell>
              <Table.HeaderCell className="px-2 sm:px-4 py-3 font-semibold text-ui-fg-base text-center text-xs sm:text-sm">
                QTY
              </Table.HeaderCell>
              <Table.HeaderCell className="px-2 sm:px-4 py-3 font-semibold text-ui-fg-base text-center text-xs sm:text-sm">
                TOTAL
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body className="border-none">
            {filteredVariants.map((variant, index) => {
              const { variantPrice } = getProductPrice({
                product,
                variantId: variant.id,
              })

              const mrp = getVariantMRP(variant)
              const bundleQty = getBundleQuantity(variant)
              const priceNumber = variantPrice?.calculated_price_number || 0
              const savingsPercentage =
                mrp && typeof priceNumber === "number" && priceNumber > 0
                  ? Math.round(((mrp - priceNumber) / mrp) * 100)
                  : 0

              const currentQuantity =
                lineItemsMap.get(variant.id)?.quantity || 0
              const lineTotal =
                typeof priceNumber === "number"
                  ? priceNumber * currentQuantity
                  : 0

              return (
                <Table.Row
                  key={variant.id}
                  className={clx("transition-colors hover:bg-neutral-25", {
                    "border-b-0": index === filteredVariants.length - 1,
                  })}
                >
                  {/* Show all option values */}
                  {productOptions.map((option) => {
                    const optionValue = variant.options?.find(
                      (opt) => opt.option_id === option.id
                    )
                    return (
                      <Table.Cell
                        key={option.id}
                        className="px-2 sm:px-4 py-3 border-x"
                      >
                        <span className="text-ui-fg-base text-xs sm:text-sm font-medium">
                          {optionValue?.value
                            ? optionValue.value.toUpperCase()
                            : "-"}
                        </span>
                      </Table.Cell>
                    )
                  })}

                  <Table.Cell className="px-2 sm:px-4 py-3 border-x">
                    {bundleQty > 1 ? (
                      <span className="text-ui-fg-subtle text-xs font-medium">
                        {bundleQty} PCS
                      </span>
                    ) : (
                      <span className="text-ui-fg-subtle text-xs font-medium">
                        1 PC
                      </span>
                    )}
                  </Table.Cell>
                  {hasMRP && (
                    <Table.Cell className="px-2 sm:px-4 py-3 border-x">
                      {mrp ? (
                        <div className="flex flex-col">
                          <span className="text-ui-fg-subtle text-xs sm:text-sm line-through">
                            {formatCurrency(mrp)}
                          </span>
                          {savingsPercentage > 0 && (
                            <span className="inline-flex items-center px-1 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full w-fit">
                              {savingsPercentage}% OFF
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-ui-fg-subtle text-xs">-</span>
                      )}
                    </Table.Cell>
                  )}
                  <Table.Cell className="px-2 sm:px-4 py-3 border-x">
                    <div className="flex flex-col">
                      <span className="font-semibold text-ui-fg-base text-xs sm:text-sm">
                        {variantPrice?.calculated_price || "N/A"}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="px-1 sm:px-2 py-3 border-x">
                    <BulkTableQuantity
                      variantId={variant.id}
                      bundleSize={bundleQty}
                      onChange={handleQuantityChange}
                    />
                  </Table.Cell>
                  <Table.Cell className="px-2 sm:px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-ui-fg-base text-xs sm:text-sm">
                        {currentQuantity > 0 ? formatCurrency(lineTotal) : "-"}
                      </span>
                    </div>
                  </Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
      </div>

      {/* Summary and Add to Cart */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col gap-2">
          <Button
            onClick={handleAddToCart}
            variant="primary"
            className="w-full sm:w-auto h-10 sm:h-12 px-6 sm:px-8 text-sm sm:text-base"
            isLoading={isPending}
            disabled={totalQuantity === 0}
            data-testid="add-product-button"
          >
            <ShoppingBag
              className="mr-2 w-4 h-4 sm:w-5 sm:h-5"
              fill={totalQuantity === 0 ? "none" : "#fff"}
            />
            {totalQuantity === 0
              ? "Choose variants above"
              : `Add ${totalQuantity} item${
                  totalQuantity !== 1 ? "s" : ""
                } to cart`}
          </Button>
          {totalQuantity > 0 && (
            <div className="text-xs sm:text-sm text-ui-fg-subtle text-center sm:text-left">
              {Array.from(lineItemsMap.values()).reduce((total, item) => {
                const bundleQty = getBundleQuantity(item)
                return total + item.quantity
              }, 0)}{" "}
              total units selected
            </div>
          )}
        </div>

        {/* Total Summary */}
        {totalQuantity > 0 && (
          <div className="bg-neutral-50 p-4 rounded-lg border">
            <div className="text-right">
              <div className="text-sm text-ui-fg-subtle">Order Total</div>
              <div className="text-lg font-bold text-ui-fg-base">
                {formatCurrency(totalValue)}
              </div>
              <div className="text-xs text-ui-fg-subtle">
                {totalQuantity} item{totalQuantity !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductVariantsTable
