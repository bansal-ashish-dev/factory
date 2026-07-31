import { Metadata } from "next"
import { Suspense } from "react"

import { listCartOptions, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getBaseURL } from "@lib/util/env"
import { StoreCartShippingOption } from "@medusajs/types"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import FreeShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge"
import { WishlistProvider } from "@providers/hybrid-wishlist-provider"
import { ToastProvider } from "@providers/toast-provider"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

// Component to handle shipping options loading asynchronously
async function FreeShippingNudgeWrapper({ cart }: { cart: any }) {
  let shippingOptions: StoreCartShippingOption[] = []

  // Only fetch shipping options if cart exists and has items
  if (cart && cart.items && cart.items.length > 0) {
    try {
      const { shipping_options } = await listCartOptions()
      shippingOptions = shipping_options
    } catch (error) {
      // Silently fail - shipping nudge is not critical
      console.warn("Failed to load shipping options:", error)
    }
  }

  if (!cart || !shippingOptions.length) {
    return null
  }

  return (
    <FreeShippingPriceNudge
      variant="popup"
      cart={cart}
      shippingOptions={shippingOptions}
    />
  )
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  // Skip non-essential data fetching during static generation
  const isStaticGeneration = !process.env.MEDUSA_BACKEND_URL

  // Fetch customer and cart data in parallel, but handle errors gracefully
  const [customer, cart] = await Promise.allSettled([
    isStaticGeneration
      ? Promise.resolve(null)
      : retrieveCustomer().catch(() => null),
    isStaticGeneration
      ? Promise.resolve(null)
      : retrieveCart().catch(() => null),
  ])

  const customerData = customer.status === "fulfilled" ? customer.value : null
  const cartData = cart.status === "fulfilled" ? cart.value : null

  return (
    <ToastProvider>
      <WishlistProvider>
        <Nav />
        {customerData && cartData && (
          <CartMismatchBanner customer={customerData} cart={cartData} />
        )}

        {/* Load shipping nudge asynchronously to prevent blocking */}
        <Suspense fallback={null}>
          <FreeShippingNudgeWrapper cart={cartData} />
        </Suspense>
        {props.children}
        <Footer />
      </WishlistProvider>
    </ToastProvider>
  )
}
