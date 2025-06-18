import { z } from 'zod'

export const categorySchema = z.object({
  id: z.string().nonempty(),
  name: z.string().nonempty(),
  imageUrl: z.string().nonempty(),
  categoryId: z.string().nonempty(),
  category: z.object({
    id: z.string().nonempty(),
    name: z.string().nonempty(),
    imageUrl: z.string().nonempty(),
    // categoryId: z.string().nonempty(),
  }),
})

export type SubCategory = z.infer<typeof categorySchema>