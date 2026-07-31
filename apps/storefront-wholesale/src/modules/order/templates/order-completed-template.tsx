import { Heading, Text } from "@medusajs/ui"
import { cookies as nextCookies } from "next/headers"

import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import { HttpTypes } from "@medusajs/types"
import { convertToLocale } from "@lib/util/money"

type OrderCompletedTemplateProps = {
  order?: HttpTypes.StoreOrder
  orderSet?: any // Orderset type
}

export default async function OrderCompletedTemplate({
  order,
  orderSet,
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()

  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"

  // Determine if we're dealing with an orderset or single order
  const isOrderSet = orderSet && orderSet.orders && orderSet.orders.length > 0
  const displayOrder = isOrderSet ? orderSet.orders[0] : order
  const allOrders = isOrderSet ? orderSet.orders : [order]

  if (!displayOrder) {
    return null
  }

  return (
    <div className="py-6 min-h-[calc(100vh-64px)]">
      <div className="content-container flex flex-col justify-center items-center gap-y-10 max-w-4xl h-full w-full">
        {isOnboarding && <OnboardingCta orderId={displayOrder.id} />}
        <div
          className="flex flex-col gap-4 max-w-4xl h-full bg-white w-full py-10"
          data-testid="order-complete-container"
        >
          <Heading
            level="h1"
            className="flex flex-col gap-y-3 text-ui-fg-base text-3xl mb-4"
          >
            <span>Thank you!</span>
            <span>Your {isOrderSet ? 'orders were' : 'order was'} placed successfully.</span>
            {isOrderSet && (
              <span className="text-lg text-ui-fg-subtle">
                You have {orderSet.orders.length} order{orderSet.orders.length > 1 ? 's' : ''} in this purchase.
              </span>
            )}
          </Heading>
          
                    {isOrderSet ? (
            // Display all orders in the orderset
            <>
              {orderSet.orders.map((orderItem: any, index: number) => (
                <div key={orderItem.id} className="border-t pt-6">
                  <Heading level="h3" className="text-xl mb-4">
                    Order #{index + 1}: {orderItem.display_id || orderItem.id.split('_').pop()}
                  </Heading>
                  <OrderDetails order={orderItem} />
                  <Heading level="h3" className="flex flex-row text-xl-regular mt-4 mb-2">
                    Items in Order #{index + 1}
                  </Heading>
                  <Items order={orderItem} />
                  <div className="mt-4">
                    <CartTotals totals={orderItem} />
                  </div>
                  <ShippingDetails order={orderItem} />
                </div>
              ))}
              {/* Show payment details at orderset level */}
              <div className="border-t pt-6 mt-6">
                <Heading level="h2" className="flex flex-row text-3xl-regular my-6">
                  Payment
                </Heading>
                <div className="flex items-start gap-x-1 w-full">
                  <div className="flex flex-col w-1/3">
                    <Text className="txt-medium-plus text-ui-fg-base mb-1">
                      Payment method
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {orderSet.payment_collection ? 'Payment Completed' : 'Payment method not available'}
                    </Text>
                  </div>
                  <div className="flex flex-col w-2/3">
                    <Text className="txt-medium-plus text-ui-fg-base mb-1">
                      Payment details
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      Total paid: {orderSet.total ? convertToLocale({
                        amount: orderSet.total,
                        currency_code: orderSet.cart?.currency_code || 'usd'
                      }) : 'Amount not available'}
                      {orderSet.payment_collection?.completed_at && (
                        <> at {new Date(orderSet.payment_collection.completed_at).toLocaleString()}</>
                      )}
                    </Text>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Display single order
            <>
              <OrderDetails order={displayOrder} />
              <Heading level="h2" className="flex flex-row text-3xl-regular">
                Summary
              </Heading>
              <Items order={displayOrder} />
              <CartTotals totals={displayOrder} />
              <ShippingDetails order={displayOrder} />
              <PaymentDetails order={displayOrder} />
            </>
          )}
          
          <Help />
        </div>
      </div>
    </div>
  )
}
