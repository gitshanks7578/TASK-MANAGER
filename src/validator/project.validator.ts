import {z} from "zod"

export const createProjectSchema = z.object({
    name : z.string().min(3,"must be atleast 3 characters long").max(20,"name can be max 20 characters long"),
    description : z.string().min(10,"must be atleast 10 characters long").max(100,"description can be max 100 characters long"),
})

export const addMemberSchema = z.object({
    email : z.email("must give valid email address")
})



export const createTaskSchema = z.object({
    title: z.string().min(1, "title is required"),
    description: z.string().optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
    dueDate: z.coerce.date().optional(),
    assigneeId: z.string().uuid().optional()
})

export const getTasksInProjectSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    status : z.enum(["TODO","IN_PROGRESS","DONE"]).default("TODO").optional(),
    priority : z.enum(["LOW","MEDIUM","HIGH"]).default("MEDIUM").optional(),
    sortBy : z.enum(["createdAt","updatedAt","title","dueDate","priority"]).default("createdAt"),
    order : z.enum(["asc","desc"]).default("desc")
})