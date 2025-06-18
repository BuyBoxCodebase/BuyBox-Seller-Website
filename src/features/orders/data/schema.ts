import { z } from 'zod'

export const orderSchema = z.object({
  id: z.string().nonempty(),
  userId: z.string().nonempty(),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  address: z.string().nonempty(),
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  totalAmount: z.number().positive(),
  paymentMode: z.enum(['CASH_ON_DELIVERY', 'ONLINE', 'CARD']),
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
      }).nullable().optional()
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
    profilePic: z.string().url().optional(),
    phoneNumber: z.number().nullable().or(z.string().nullable()),
  })
})

export type Order = z.infer<typeof orderSchema>