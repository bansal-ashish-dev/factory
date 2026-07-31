"use client"

import { isManual, isStripe } from "@lib/constants"
import { placeOrder } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import React, { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import ErrorMessage from "../error-message"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  "data-testid": string
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  "data-testid": dataTestId,
}) => {
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1

  const paymentSession = cart.payment_collection?.payment_sessions?.[0]
  
  // Check all payment sessions to find an active one
  const activePaymentSession = cart.payment_collection?.payment_sessions?.find(
    (session) => session.status === "pending"
  )

  switch (true) {
    case isStripe(paymentSession?.provider_id) || isStripe(activePaymentSession?.provider_id):
      return (
        <StripePaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    case isManual(paymentSession?.provider_id) || isManual(activePaymentSession?.provider_id):
      return (
        <ManualTestPaymentButton notReady={notReady} data-testid={dataTestId} />
      )
    // If no specific payment session is found but we have payment sessions available
    case (!paymentSession && !!activePaymentSession):
      // Default to manual payment if available
      const manualSession = cart.payment_collection?.payment_sessions?.find(
        (session) => isManual(session.provider_id)
      )
      if (manualSession) {
        return (
          <ManualTestPaymentButton notReady={notReady} data-testid={dataTestId} />
        )
      }
      return <Button disabled>Select a payment method</Button>
    default:
      return <Button disabled>Select a payment method</Button>
  }
}

const StripePaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()
  const params = useParams()
  const currentCountryCode = params.countryCode as string

  const onPaymentCompleted = async () => {
    try {
      const result = await placeOrder(undefined, false) // Don't redirect, handle it client-side
      
      if (result && typeof result === 'object' && 'order_set' in result) {
        const orderSet = (result as any).order_set
        if (orderSet && orderSet.orders && orderSet.orders.length > 0) {
          const firstOrder = orderSet.orders[0]
          // Use current country code from URL instead of order's country code
          const countryCode = currentCountryCode || firstOrder.shipping_address?.country_code?.toLowerCase() || 'us'
          // Redirect to first order confirmation page, but pass orderset data
          router.push(`/${countryCode}/order/${firstOrder.id}/confirmed?orderset=${orderSet.id}`)
        }
      } else if (result && typeof result === 'object' && 'type' in result && result.type === "order") {
        // Fallback for traditional order response
        const countryCode = currentCountryCode || (result as any).order.shipping_address?.country_code?.toLowerCase() || 'us'
        router.push(`/${countryCode}/order/${(result as any).order.id}/confirmed`)
      }
    } catch (err: any) {
      setErrorMessage(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const stripe = useStripe()
  const elements = useElements()
  const card = elements?.getElement("card")

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  const disabled = !stripe || !elements ? true : false

  const handlePayment = async () => {
    setSubmitting(true)

    if (!stripe || !elements || !card || !cart) {
      setSubmitting(false)
      return
    }

    await stripe
      .confirmCardPayment(session?.data.client_secret as string, {
        payment_method: {
          card: card,
          billing_details: {
            name:
              cart.billing_address?.first_name +
              " " +
              cart.billing_address?.last_name,
            address: {
              city: cart.billing_address?.city ?? undefined,
              country: cart.billing_address?.country_code ?? undefined,
              line1: cart.billing_address?.address_1 ?? undefined,
              line2: cart.billing_address?.address_2 ?? undefined,
              postal_code: cart.billing_address?.postal_code ?? undefined,
              state: cart.billing_address?.province ?? undefined,
            },
            email: cart.email,
            phone: cart.billing_address?.phone ?? undefined,
          },
        },
      })
      .then(({ error, paymentIntent }) => {
        if (error) {
          const pi = error.payment_intent

          if (
            (pi && pi.status === "requires_capture") ||
            (pi && pi.status === "succeeded")
          ) {
            onPaymentCompleted()
          }

          setErrorMessage(error.message || null)
          return
        }

        if (
          (paymentIntent && paymentIntent.status === "requires_capture") ||
          paymentIntent.status === "succeeded"
        ) {
          return onPaymentCompleted()
        }

        return
      })
  }

  return (
    <>
      <Button
        disabled={disabled || notReady}
        onClick={handlePayment}
        size="large"
        isLoading={submitting}
        data-testid={dataTestId}
      >
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="stripe-payment-error-message"
      />
    </>
  )
}

const ManualTestPaymentButton = ({ 
  notReady,
  "data-testid": dataTestId 
}: { 
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()
  const params = useParams()
  const currentCountryCode = params.countryCode as string

  const onPaymentCompleted = async () => {
    try {
      const result = await placeOrder(undefined, false) // Don't redirect, handle it client-side
      
      if (result && typeof result === 'object' && 'order_set' in result) {
        const orderSet = (result as any).order_set
        if (orderSet && orderSet.orders && orderSet.orders.length > 0) {
          const firstOrder = orderSet.orders[0]
          // Use current country code from URL instead of order's country code
          const countryCode = currentCountryCode || firstOrder.shipping_address?.country_code?.toLowerCase() || 'us'
          // Redirect to first order confirmation page, but pass orderset data
          router.push(`/${countryCode}/order/${firstOrder.id}/confirmed?orderset=${orderSet.id}`)
        }
      } else if (result && typeof result === 'object' && 'type' in result && result.type === "order") {
        // Fallback for traditional order response
        const countryCode = currentCountryCode || (result as any).order.shipping_address?.country_code?.toLowerCase() || 'us'
        router.push(`/${countryCode}/order/${(result as any).order.id}/confirmed`)
      }
    } catch (err: any) {
      setErrorMessage(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handlePayment = () => {
    setSubmitting(true)

    onPaymentCompleted()
  }

  return (
    <>
      <Button
        disabled={notReady}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        data-testid={dataTestId || "submit-order-button"}
      >
        Place order (Manual Payment)
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="manual-payment-error-message"
      />
    </>
  )
}

export default PaymentButton
