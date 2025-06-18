import { z } from 'zod'

export const productSchema = z.object({
  id: z.string().nonempty(),
  brandId: z.string().nonempty(),
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  images: z.array(z.string().nonempty()),
  categoryId: z.string().nullable(),
  subCategoryId: z.string().nullable(),
  basePrice: z.number(),
  attributes: z.unknown(),
  createdAt: z.string().nonempty(),
  updatedAt: z.string().nonempty(),
  category: z.object({
    id: z.string().nonempty(),
    name: z.string().nonempty(),
    imageUrl: z.string().nonempty(),
  }).nullable(),
  subCategory: z.object({
    id: z.string().nonempty(),
    name: z.string().nonempty(),
    imageUrl: z.string().nonempty(),
    categoryId: z.string().nonempty(),
  }).nullable(),
  price: z.number(),
  inventory: z.array(z.object({
    quantity: z.number(),
  })).nullable(),
  defaultVariant: z.object({
    id: z.string().nonempty(),
    productId: z.string().nonempty(),
    price: z.number(),
    isDefault: z.boolean(),
    images: z.array(z.string().nonempty()),
    createdAt: z.string().nonempty(),
    updatedAt: z.string().nonempty(),
    inventory: z.array(z.object({
      quantity: z.number(),
    })),
    options: z.array(
      z.object({
        optionValue: z.object({
          value: z.string().nonempty(),
        }),
      })
    ),
  }).nullable(),
})

export type Product = z.infer<typeof productSchema>



// {
//   "id": "67dc4234ab18c07f17b270cd",
//   "brandId": "67cb612cbce3fca45d32e8a3",
//   "name": "Pratyush Pal tara koreche",
//   "description": "B G V G",
//   "images": [
//       "http://res.cloudinary.com/dj8cmm02s/image/upload/v1742488114/r19nabf0ufpjbkuv4gnb.jpg",
//       "http://res.cloudinary.com/dj8cmm02s/image/upload/v1742488112/qeqvcjf1kjbkqwufiwlg.jpg"
//   ],
//   "categoryId": "67d55a62b22ab932c3e48741",
//   "subCategoryId": "67d55b6eb22ab932c3e48742",
//   "basePrice": 2069,
//   "attributes": null,
//   "createdAt": "2025-03-20T16:28:36.336Z",
//   "updatedAt": "2025-03-20T16:29:36.641Z",
//   "category": {
//       "id": "67d55a62b22ab932c3e48741",
//       "name": "Instant food, snacks & beverages ",
//       "imageUrl": "http://res.cloudinary.com/dheifvet6/image/upload/v1742035550/pucqnkha9347yszfjg2h.jpg"
//   },
//   "subCategory": {
//       "id": "67d55b6eb22ab932c3e48742",
//       "name": "Instant Foods",
//       "imageUrl": "http://res.cloudinary.com/dheifvet6/image/upload/v1742035816/ldauverncarzrj5te9ae.jpg",
//       "categoryId": "67d55a62b22ab932c3e48741"
//   },
//   "price": 69,
//   "inventory": [
//       {
//           "quantity": 100
//       }
//   ],
//   "defaultVariant": {
//       "id": "67dc47d1ab18c07f17b270d2",
//       "productId": "67dc4234ab18c07f17b270cd",
//       "name": "Pratyush tara koreche",
//       "description": "B G ",
//       "price": 69,
//       "isDefault": true,
//       "images": [
//           "http://res.cloudinary.com/dj8cmm02s/image/upload/v1742489555/zrnxhn2pmyboerecw8e5.jpg"
//       ],
//       "createdAt": "2025-03-20T16:52:33.649Z",
//       "updatedAt": "2025-03-20T16:53:30.898Z",
//       "inventory": [
//           {
//               "quantity": 100
//           }
//       ],
//       "options": [
//           {
//               "optionValue": {
//                   "value": "White"
//               }
//           }
//       ]
//   }
// }