import { retrieveOrder, retrieveOrderSet } from "@lib/data/orders"
import OrderCompletedTemplate from "@modules/order/templates/order-completed-template"
import { Metadata } from "next"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ orderset?: string }>
}
export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "You purchase was successful",
}

export default async function OrderConfirmedPage(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { id } = params
  const { orderset } = searchParams
  
  // If orderset parameter is provided, retrieve orderset data
  if (orderset) {
    try {
      const orderSet = await retrieveOrderSet(orderset)
      if (orderSet && orderSet.orders && orderSet.orders.length > 0) {
        return <OrderCompletedTemplate orderSet={orderSet} />
      }
    } catch (error) {
      console.error('Failed to retrieve orderset:', error)
      // Fall through to single order retrieval
    }
  }
  
  // Check if the ID is an orderset ID (starts with 'ordset_')
  const isOrderSetId = id.startsWith('ordset_')
  
  if (isOrderSetId) {
    // This is an orderset ID, try to retrieve orderset data
    try {
      const orderSet = await retrieveOrderSet(id)
      if (orderSet && orderSet.orders && orderSet.orders.length > 0) {
        return <OrderCompletedTemplate orderSet={orderSet} />
      }
    } catch (error) {
      console.error('Failed to retrieve orderset:', error)
      // Fall through to single order retrieval
    }
  }
  
  // Try to retrieve as single order (either orderset ID failed or it's actually an order ID)
  const order = await retrieveOrder(id).catch(() => null)

  if (!order) {
    return notFound()
  }

  return <OrderCompletedTemplate order={order} />
}
