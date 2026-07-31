"use client"

import { RadioGroup, Radio as RadioGroupOption } from "@headlessui/react"
import { setShippingMethod, removeShippingMethods } from "@lib/data/cart"
import { CheckCircleSolid, XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Container, Heading, Text, clx } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import Radio from "@modules/common/components/radio"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { B2BCart } from "types/global"
import ErrorMessage from "../error-message"
import Button from "@modules/common/components/button"
import { convertToLocale } from "@lib/util/money"

type ShippingProps = {
  cart: B2BCart
  availableShippingMethods: HttpTypes.StoreCartShippingOption[] | null
}

const Shipping: React.FC<ShippingProps> = ({
  cart,
  availableShippingMethods,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "delivery"

  const selectedShippingMethod = availableShippingMethods?.find(
    (method) => method.id === cart.shipping_methods?.at(-1)?.shipping_option_id
  )

  const selectedMethodId = selectedShippingMethod?.id || ""

  // Determine if multiple delivery methods might be needed
  // We'll check if there are distinct shipping options or if cart items have different requirements
  const sellerIds = Array.from(
    new Set(
      cart.items?.map((item) => {
        // Try to get seller from metadata or product metadata
        const sellerId = 
          (item.metadata?.seller_id as string) ||
          (item.product?.metadata?.seller_id as string) ||
          item.product?.id || // Fallback to product ID as unique identifier
          'default'
        return sellerId
      }).filter(Boolean)
    )
  )
  
  // If we have more than 3 unique shipping options, it might indicate multiple sellers
  const hasMultipleShippingRequirements = 
    sellerIds.length > 1 || 
    (availableShippingMethods && availableShippingMethods.length > 3)
  
  const hasMultipleSellers = hasMultipleShippingRequirements

  // Get selected shipping methods
  const selectedShippingMethods = cart.shipping_methods || []
  
  // Check if we have sufficient shipping methods
  const hasRequiredShippingMethods = hasMultipleSellers 
    ? selectedShippingMethods.length >= Math.min(sellerIds.length, 2) // Limit to reasonable number
    : selectedShippingMethods.length >= 1

  const handleEdit = () => {
    router.push(pathname + "?step=delivery", { scroll: false })
  }

  const handleSubmit = () => {
    router.push(pathname + "?step=payment", { scroll: false })
  }

  const set = async (id: string) => {
    setIsLoading(true)
    await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleRemoveShippingMethod = async (methodId: string) => {
    setIsLoading(true)
    await removeShippingMethods({
      cartId: cart.id,
      shippingMethodIds: [methodId],
    })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  return (
    <Container>
      <div className="flex flex-col gap-y-2">
        <div className="flex flex-row items-center justify-between w-full">
          <Heading
            level="h2"
            className={clx("flex flex-row text-xl gap-x-2 items-center", {
              "opacity-50 pointer-events-none select-none":
                !isOpen && cart.shipping_methods?.length === 0,
            })}
          >
            Delivery Method
            {!isOpen && (cart.shipping_methods?.length ?? 0) > 0 && (
              <CheckCircleSolid />
            )}
          </Heading>
          {!isOpen &&
            cart?.shipping_address &&
            cart?.billing_address &&
            cart?.email && (
              <Text>
                <button
                  onClick={handleEdit}
                  className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
                  data-testid="edit-delivery-button"
                >
                  Edit
                </button>
              </Text>
            )}
        </div>
        {(isOpen || (cart && (cart.shipping_methods?.length ?? 0) > 0)) && (
          <Divider />
        )}
      </div>
      {isOpen ? (
        <div data-testid="delivery-options-container">
          {hasMultipleSellers && (
            <div className="mb-4 p-4 bg-ui-bg-subtle rounded-lg border border-ui-border-base">
              <Text className="text-ui-fg-base font-medium mb-2 flex items-center gap-2">
                <CheckCircleSolid className="w-4 h-4 text-ui-fg-interactive" />
                Multiple Delivery Methods Required
              </Text>
              <Text className="text-ui-fg-subtle text-sm mb-2">
                Your cart contains items from <strong>{sellerIds.length}</strong> different
                sellers. You need to select a delivery method for each seller to proceed.
              </Text>
              <div className="mt-2 p-2 bg-ui-bg-base rounded border">
                <Text className="text-xs text-ui-fg-muted">
                  Status: {selectedShippingMethods.length} of {sellerIds.length} delivery methods selected
                  {!hasRequiredShippingMethods && (
                    <span className="text-ui-fg-error ml-1">
                      - {sellerIds.length - selectedShippingMethods.length} more required
                    </span>
                  )}
                </Text>
              </div>
            </div>
          )}

          {!hasMultipleSellers && selectedShippingMethods.length === 0 && (
            <div className="mb-4 p-3 bg-ui-bg-subtle rounded-md border border-ui-border-base">
              <Text className="text-ui-fg-base font-medium mb-1">
                Select a Delivery Method
              </Text>
              <Text className="text-ui-fg-subtle text-sm">
                Please choose one of the available delivery methods below to continue with your order.
              </Text>
            </div>
          )}

          {/* Show currently selected shipping methods */}
          {selectedShippingMethods.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <Text className="font-medium text-ui-fg-base">
                  Selected Delivery Methods ({selectedShippingMethods.length}):
                </Text>
                {hasMultipleSellers && (
                  <Text className="text-sm text-ui-fg-subtle">
                    {hasRequiredShippingMethods ? "✓ All required methods selected" : `${sellerIds.length - selectedShippingMethods.length} more needed`}
                  </Text>
                )}
              </div>
              <div className="space-y-2">
                {selectedShippingMethods.map((method, index) => {
                  const methodOption = availableShippingMethods?.find(
                    (option) => option.id === method.shipping_option_id
                  )
                  return (
                    <div
                      key={method.id}
                      className="flex items-center justify-between p-3 border border-ui-border-base rounded-md bg-ui-bg-field"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircleSolid className="text-ui-fg-interactive w-5 h-5" />
                        <div>
                          <Text className="font-medium">
                            {methodOption?.name || method.name}
                          </Text>
                          <Text className="text-ui-fg-subtle text-sm">
                            {convertToLocale({
                              amount: method.amount!,
                              currency_code: cart?.currency_code,
                            })}
                            {hasMultipleSellers && (
                              <span className="ml-2 text-xs text-ui-fg-muted">
                                • Method {index + 1} of {sellerIds.length}
                              </span>
                            )}
                          </Text>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveShippingMethod(method.id)}
                        className="p-2 hover:bg-ui-bg-subtle rounded-md text-ui-fg-muted hover:text-ui-fg-base transition-colors"
                        disabled={isLoading}
                        title="Remove this delivery method"
                      >
                        <XMark className="w-4 h-4" />
                      </button>
                    </div>
                  )
                })}
              </div>
              <Divider className="my-4" />
            </div>
          )}

          <div className="">
            <Text className="font-medium text-ui-fg-base mb-3">
              Available Delivery Methods:
            </Text>
            <RadioGroup value={selectedMethodId} onChange={set}>
              {availableShippingMethods?.map((option) => (
                <div key={option.id}>
                  <RadioGroupOption
                    value={option.id}
                    data-testid="delivery-option-radio"
                    className={clx(
                      "flex items-center justify-between text-small-regular cursor-pointer py-2",
                      {
                        "border-ui-border-interactive":
                          option.id === selectedShippingMethod?.id,
                      }
                    )}
                  >
                    <div className="flex items-center gap-x-4">
                      <Radio
                        checked={option.id === selectedShippingMethod?.id}
                      />
                      <span className="text-base-regular">{option.name}</span>
                    </div>
                    <span className="justify-self-end text-ui-fg-base">
                      {convertToLocale({
                        amount: option.amount!,
                        currency_code: cart?.currency_code,
                      })}
                    </span>
                  </RadioGroupOption>
                  <Divider />
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className="flex flex-col gap-y-2 items-end">
            <ErrorMessage
              error={error}
              data-testid="delivery-option-error-message"
            />

            <Button
              size="large"
              className="mt-4"
              onClick={handleSubmit}
              isLoading={isLoading}
              disabled={!hasRequiredShippingMethods}
              data-testid="submit-delivery-option-button"
            >
              {!hasRequiredShippingMethods && hasMultipleSellers
                ? `Select ${sellerIds.length - selectedShippingMethods.length} more delivery method${sellerIds.length - selectedShippingMethods.length > 1 ? 's' : ''}`
                : !hasRequiredShippingMethods
                ? "Select a delivery method"
                : "Next step"}
            </Button>
          </div>
        </div>
      ) : (
        cart.shipping_methods &&
        cart.shipping_methods?.length > 0 && (
          <div className="text-small-regular pt-2">
            <div className="flex flex-col w-full">
              <div className="flex items-center justify-between mb-2">
                <Text className="txt-medium-plus text-ui-fg-base">
                  Selected Delivery Methods ({cart.shipping_methods.length}):
                </Text>
                {hasMultipleSellers && (
                  <Text className="text-xs text-ui-fg-subtle">
                    {hasRequiredShippingMethods ? "All sellers covered" : "Incomplete selection"}
                  </Text>
                )}
              </div>
              <div className="space-y-2">
                {cart.shipping_methods.map((method, index) => {
                  const methodOption = availableShippingMethods?.find(
                    (option) => option.id === method.shipping_option_id
                  )
                  return (
                    <div
                      key={method.id}
                      className="flex items-center justify-between p-2 border border-ui-border-base rounded-md bg-ui-bg-subtle"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircleSolid className="w-4 h-4 text-ui-fg-interactive" />
                        <div>
                          <Text className="txt-medium text-ui-fg-base">
                            {methodOption?.name || method.name}
                          </Text>
                          {hasMultipleSellers && (
                            <Text className="text-xs text-ui-fg-muted">
                              Seller {index + 1} of {sellerIds.length}
                            </Text>
                          )}
                        </div>
                      </div>
                      <Text className="txt-medium text-ui-fg-subtle">
                        {convertToLocale({
                          amount: method.amount!,
                          currency_code: cart?.currency_code,
                        })}
                      </Text>
                    </div>
                  )
                })}
              </div>
              {hasMultipleSellers && !hasRequiredShippingMethods && (
                <Text className="text-xs text-ui-fg-error mt-2">
                  Missing {sellerIds.length - cart.shipping_methods.length} delivery method(s)
                </Text>
              )}
            </div>
          </div>
        )
      )}
    </Container>
  )
}

export default Shipping
