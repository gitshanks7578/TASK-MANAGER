import type { Request, Response, NextFunction } from "express"
import ApiError from "../utils/apiError.js"
import { prisma } from "../db/db.js"
import type { authRequest } from "../middleware/verifyjwt.js"
import { updateTaskSchema } from "../validator/task.validator.js"
import { deleteTaskService, updateTaskService } from "../services/task.service.js"

export const updateTask = async(req:authRequest,res:Response,next:NextFunction) =>{
    try {
        const {id} = req.params
        if(typeof id !== "string"){
            throw new ApiError("invalid task id",400)
        }
        const result = updateTaskSchema.safeParse(req.body)
        if(!result.success){
            throw new ApiError("invalid data format",400)
        }


        const updatedTask = await updateTaskService(id,result.data,req.user!.id)

        return res.status(200).json({
            success : true,
            message : "task updated successfully",
            data : updatedTask
        })

    } catch (error) {
        next(error)
    }
}

export const deleteTask = async (req:authRequest,res:Response,next:NextFunction) =>{
    try {
        const {id} = req.params
        if(typeof id !== "string"){
            throw new ApiError("invalid task id",400)
        }


        const deletetask = await deleteTaskService(id,req.user!.id)

        return res.status(200).json({
            success: true,
            message : "task deleted successfully",
            data : deletetask
        })
    } catch (error) {
        next(error)
    }
}