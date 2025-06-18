import { createLazyFileRoute } from '@tanstack/react-router'
import Orders from '@/features/orders'

export const Route = createLazyFileRoute('/_authenticated/orders/')({
  component: Orders,
})
