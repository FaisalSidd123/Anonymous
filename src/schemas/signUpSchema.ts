import {z} from 'zod';

export const usernameValidation= 

z.string()
.min(2,"Atleast 2 Character")
.max(20,"Not more than 20")
.regex(/^[a-zA-Z0-9_]+$/,"Username must not contain sc")

export const signUpSchema = z.object({

    username:usernameValidation,
    email:z.string().email({message:'Invalid Email'}),
    password:z.string().min(6,{message:"pass should be atleast 6 chars"})
})