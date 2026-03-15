import {z} from 'zod'

export const signInSchema = z.object({
    identifier:z.string(), //yeh username
    password:z.string()
})

