import { z } from 'zod'

export const videosSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  productId: z.string().min(1, 'Product ID is required'),
  size: z.string().min(1, 'Size is required'),
  caption: z.string().min(1, 'Caption is required'),
  videoUrl: z.string().min(1, 'Video URL is required'),
})

export type Videos = z.infer<typeof videosSchema>


// {
//     "id": "690136eba99340c0d88a4c89",
//     "productId": "69013071a99340c0d88a4c87",
//     "caption": "ss",
//     "size": "S",
//     "videoUrl": "https://youtu.be/HYCYGFuy-VM",
//     "createdAt": "2025-10-28T21:34:35.910Z",
//     "updatedAt": "2025-10-28T21:34:35.910Z"
//   }