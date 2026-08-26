import {z} from "zod"

export const createProjectSchema = z.object({
    name : z.string().min(3,"must be atleast 3 characters long").max(20,"name can be max 20 characters long"),
    description : z.string().min(10,"must be atleast 10 characters long").max(100,"description can be max 100 characters long"),
})