import { profile } from 'console'
import {z} from 'zod'

const userSchema = z.object({
    id: z.string().nonempty(),
    email: z.string().nonempty(),
    name: z.string().nonempty(),
    profilePic: z.string().optional(),
    isCompleted: z.boolean().optional(),
    username: z.string().optional(),
})

export type User = z.infer<typeof userSchema>