import {z} from "zod"

export const registerSchema = z.object({
    name : z.string().min(3,"must be atleast 3 characters long").max(20,"name can be max 20 characters long"),
    email : z.email("must be a valid email address"),
    password : z.string().min(8,"password must be atleast 8 characters long").max(20,"password can be max 20 characters long"),
})

export const loginSchema = z.object({
    email : z.email("must be a valid email address"),
    password : z.string().min(8,"password must be atleast 8 characters long").max(20,"password can be max 20 characters long"),
})