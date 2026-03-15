import {z} from 'zod'

export const MessageSchema = z.object({
    content:
    z.
    string()
    .min(10,{message:"content must be atleast 20 chars"}) //yeh username
    .max(300,{message:'Message should not be longer than 300 chars'})
   
})

