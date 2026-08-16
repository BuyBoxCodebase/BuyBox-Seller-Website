import { z } from 'zod'

export const orderSchema = z.object({
  id: z.string().nonempty(),
  userId: z.string().nonempty(),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  address: z.string().nonempty(),
  status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELED', 'OUT_OF_STOCK']),
  totalAmount: z.number().positive(),
  paymentMode: z.enum([
    'CASH_ON_DELIVERY',
    'CREDIT_CARD',
    'DEBIT_CARD',
    'UPI',
    'NETBANKING',
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

// What a seller can set a PENDING order to, mirroring
// OrderService.SELLER_SETTABLE_STATUSES on the backend.
export const sellerActions = [
  { label: 'Accept Order', value: 'PROCESSING' },
  { label: 'Out of Stock', value: 'OUT_OF_STOCK' },
] as const satisfies ReadonlyArray<{ label: string; value: OrderStatus }>

export const statusLabels: Record<OrderStatus, string> = {
  PENDING: 'Pending',
  PROCESSING: 'Accepted',
  COMPLETED: 'Completed',
  CANCELED: 'Cancelled',
  OUT_OF_STOCK: 'Out of Stock',
}