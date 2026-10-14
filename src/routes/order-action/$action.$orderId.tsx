import { createFileRoute } from '@tanstack/react-router'
import OrderActionPage from '@/features/order-action'

// Opened from the WhatsApp new-order message: /order-action/confirm/:orderId or /order-action/out-of-stock/:orderId
export const Route = createFileRoute('/order-action/$action/$orderId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { action, orderId } = Route.useParams()
  return <OrderActionPage action={action} orderId={orderId} />
}
