import { z } from 'zod'

export const orderSchema = z.object({
  id: z.string().nonempty(),
  userId: z.string().nonempty(),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  address: z.string().nonempty(),
  status: z.enum([
    'PENDING',
    'PROCESSING',
    'COMPLETED',
    'CANCELED',
    'OUT_OF_STOCK',
    'READY_FOR_PICKUP',
    'DISPATCHED',
    'OUT_FOR_DELIVERY',
  ]),
  fulfillmentType: z.enum(['DELIVERY', 'PICKUP']).optional(),
  totalAmount: z.number().positive(),
  paymentMode: z.enum([
    'CASH_ON_DELIVERY',
    'CREDIT_CARD',
    'DEBIT_CARD',
    'UPI',
    'NETBANKING',
    'ECOCASH',
  ]),
  deliveryAgentId: z.string().nullable(),
  createdAt: z.string().datetime(),
  products: z.array(z.object({
    product: z.object({
      name: z.string().nonempty(),
      description: z.string(),
      images: z.array(z.string().url()),
      category: z.object({
        name: z.string().nonempty()
      }).nullable().optional(),
      subCategory: z.object({
        name: z.string().nonempty()
      }).nullable().optional(),
      reels: z.array(z.object({
        size: z.string().nonempty(),
      })).optional()
    }),
    variant: z.object({
      id: z.string().nonempty(),
      name: z.string().nonempty(),
      description: z.string().optional(),
      price: z.number().positive(),
      images: z.array(z.string().url()).optional(),
      formattedOptions: z.array(z.object({
        name: z.string().nonempty(),
        value: z.string().nonempty()
      })).optional()
    }).nullable().optional(),
    quantity: z.number().positive(),
    totalPrice: z.number().positive()
  })),
  user: z.object({
    id: z.string().nonempty(),
    name: z.string().nonempty(),
    email: z.string().email(),
    profilePic: z.string().url().nullable().optional(),
    phoneNumber: z.number().nullable().or(z.string().nullable()),
  })
})

export type Order = z.infer<typeof orderSchema>
export type OrderStatus = Order['status']

type SellerAction = { label: string; value: OrderStatus }

// What a seller can move an order to from its current status, mirroring
// OrderService.SELLER_TRANSITIONS on the backend. Pickup orders go on to
// READY_FOR_PICKUP; delivery orders to DISPATCHED / OUT_FOR_DELIVERY. Both
// end at COMPLETED (collected / delivered).
export function getSellerActions(order: Pick<Order, 'status' | 'fulfillmentType'>): SellerAction[] {
  const isPickup = order.fulfillmentType === 'PICKUP'
  const delivered: SellerAction = { label: 'Mark Delivered', value: 'COMPLETED' }
  switch (order.status) {
    case 'PENDING':
      return [
        { label: 'Accept Order', value: 'PROCESSING' },
        { label: 'Out of Stock', value: 'OUT_OF_STOCK' },
      ]
    case 'PROCESSING':
      return isPickup
        ? [{ label: 'Ready for Pickup', value: 'READY_FOR_PICKUP' }]
        : [
            { label: 'Dispatched', value: 'DISPATCHED' },
            { label: 'Out for Delivery', value: 'OUT_FOR_DELIVERY' },
          ]
    case 'READY_FOR_PICKUP':
      return [{ label: 'Mark Completed', value: 'COMPLETED' }]
    case 'DISPATCHED':
      return [
        { label: 'Out for Delivery', value: 'OUT_FOR_DELIVERY' },
        delivered,
      ]
    case 'OUT_FOR_DELIVERY':
      return [delivered]
    default:
      return []
  }
}

export const statusLabels: Record<OrderStatus, string> = {
  PENDING: 'Pending',
  PROCESSING: 'Accepted',
  COMPLETED: 'Completed',
  CANCELED: 'Cancelled',
  OUT_OF_STOCK: 'Out of Stock',
  READY_FOR_PICKUP: 'Ready for Pickup',
  DISPATCHED: 'Dispatched',
  OUT_FOR_DELIVERY: 'Out for Delivery',
}