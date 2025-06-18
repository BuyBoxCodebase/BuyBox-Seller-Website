// [{ "id": "67d201a232a5887a3e386bf4", "productId": "67d201a232a5887a3e386bf3", "name": "Size", "_count": { "values": 3 }, "values": [{ "id": "67d201a232a5887a3e386bf6", "value": "M" }, { "id": "67d201a232a5887a3e386bf5", "value": "S" }, { "id": "67d201a232a5887a3e386bf7", "value": "L" }] }, { "id": "67d34bb4c7b3af40c2927565", "productId": "67d201a232a5887a3e386bf3", "name": "Flavor", "_count": { "values": 2 }, "values": [{ "id": "67d34bb5c7b3af40c2927566", "value": "Palas Da" }, { "id": "67d34bb5c7b3af40c2927567", "value": "Strwaberry" }] }, { "id": "67d34bb5c7b3af40c2927568", "productId": "67d201a232a5887a3e386bf3", "name": "Cuisine", "_count": { "values": 2 }, "values": [{ "id": "67d34bb5c7b3af40c292756a", "value": "Chineese" }, { "id": "67d34bb5c7b3af40c2927569", "value": "Indian" }] }]
import { z } from 'zod'

export const optionSchema = z.object({
    id: z.string().nonempty(),
    productId: z.string().nonempty(),
    name: z.string().nonempty(),
    _count: z.object({
        values: z.number(),
    }),
    values: z.array(
        z.object({
        id: z.string().nonempty(),
        value: z.string().nonempty(),
        })
    ),
})

export type Options = z.infer<typeof optionSchema>

export const variantSchema = z.object({
    id: z.string().nonempty(),
    productId: z.string().nonempty(),
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.number(),
    isDefault: z.boolean(),
    images: z.array(z.string().nonempty()),
    createdAt: z.string().nonempty(),
    updatedAt: z.string().nonempty(),
    inventory: z.array(z.object({
        quantity: z.number(),
        restockDate: z.string().nullable(),
    })),
    options: z.array(
        z.object({
        optionValue: z.object({
            value: z.string().nonempty(),
            id: z.string().nonempty(),
            option: z.object({
                id: z.string().nonempty(),
                name: z.string().nonempty(),
            }),
        }),
        })
    ).nullable(),
})

export type Variant = z.infer<typeof variantSchema>

// {
//     "id": "67d406fafe51c726a4578d99",
//     "productId": "67d201a232a5887a3e386bf3",
//     "price": 100,
//     "isDefault": false,
//     "images": [
//         "http://res.cloudinary.com/dj8cmm02s/image/upload/v1741948660/qthukw9gf69e03wxlk46.jpg"
//     ],
//     "createdAt": "2025-03-14T10:37:46.516Z",
//     "updatedAt": "2025-03-14T10:37:46.516Z",
//     "inventory": {
//         "quantity": 10,
//         "restockDate": null
//     },
//     "options": [
//         {
//             "optionValue": {
//                 "value": "S",
//                 "option": {
//                     "name": "Size"
//                 }
//             }
//         },
//         {
//             "optionValue": {
//                 "value": "Palas Da",
//                 "option": {
//                     "name": "Flavor"
//                 }
//             }
//         },
//         {
//             "optionValue": {
//                 "value": "Chineese",
//                 "option": {
//                     "name": "Cuisine"
//                 }
//             }
//         }
//     ]
// }