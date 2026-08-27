import {z} from "zod"

export const updateTaskSchema = z.object({
    title : z.string().min(2).optional(),
    description : z.string().min(5).optional(),
    status : z.enum(['TODO',"IN_PROGRESS","DONE"]).optional(),
    priority : z.enum(["LOW","MEDIUM","HIGH"]).optional(),
    dueDate : z.coerce.date().nullable().optional(),
    assigneeId :z.string().uuid().nullable().optional()

})