import type { Request, Response, NextFunction } from "express"
import ApiError from "../utils/apiError.js"
import { prisma } from "../db/db.js"
import type { authRequest } from "../middleware/verifyjwt.js"
import { createProjectSchema } from "../validator/project.validator.js"
export const createProject = async(req: authRequest,res:Response,next:NextFunction)=>{
    try{
        const result = createProjectSchema.safeParse(req.body)
        if(!result.success){
            const message = result.error.issues.map((issue)=>issue.message).join(", ")
            throw new ApiError(`invalid request body : ${message}`,400)
        }

        
    }catch(error){
        next(error)
    }
}