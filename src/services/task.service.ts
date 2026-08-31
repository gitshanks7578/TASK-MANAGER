import {prisma} from "../db/db.js"
import ApiError from "../utils/apiError.js"
import z from "zod"
import type { updateTaskSchema } from "../validator/task.validator.js"


export const updateTaskService = async (taskId :string , data : z.infer<typeof updateTaskSchema>,userid :string ) =>{
   
   const task = await prisma.task.findUnique({
    where : {
        id : taskId
    }
   })

   if(!task){
    throw new ApiError("task does not exists",404)
   }
   const isMember = await prisma.projectMember.findUnique({
    where : {
        userId_projectId:{
            userId : userid,
            projectId : task.projectId
        }
    }
   })
   if(!isMember){
        throw new ApiError("only project members can update tasks",403)
   }
   
    return await prisma.task.update({
        where : {
            id : taskId
        },
        data:{
            ...(data.title !== undefined && {
                title : data.title
            }),
             ...(data.description !== undefined && {
                description : data.description
            }),
             ...(data.status !== undefined && {
                status : data.status,
                completedAt : data.status === "DONE" ? new Date() : null
            }),
             ...(data.priority !== undefined && {
                priority : data.priority
            }),
             ...(data.dueDate !== undefined && {
                dueDate : data.dueDate
            }),
               ...(data.assigneeId !== undefined && {
                assigneeId : data.assigneeId
            }),



        }
    })
}


export const deleteTaskService = async(taskId  :string, userId : string) =>{
    const task = await prisma.task.findUnique({
        where : {
            id : taskId
        },
        include:{
            project:true
        }
    })
   
    
    if(!task){
        throw new ApiError("task with this ID doesn't exist",404)
    }
    if(task.creatorId !== userId && task.project.ownerId !== userId){
        throw new ApiError("unauthorized deletion",403)
    }
     

    return await prisma.task.delete({
        where :{
            id : taskId
        }
    })
}