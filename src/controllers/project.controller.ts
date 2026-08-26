import type { Request, Response, NextFunction } from "express"
import ApiError from "../utils/apiError.js"
import { prisma } from "../db/db.js"
import type { authRequest } from "../middleware/verifyjwt.js"
import { createProjectSchema } from "../validator/project.validator.js"
import { createProjectService,getAllProjectsService } from "../services/project.service.js"



export const createProject = async(req: authRequest,res:Response,next:NextFunction)=>{
    try{
        const result = createProjectSchema.safeParse(req.body)
        if(!result.success){
            const message = result.error.issues.map((issue)=>issue.message).join(", ")
            throw new ApiError(`invalid request body : ${message}`,400)
        }

        const project = await createProjectService(result.data.name,result.data.description,req.user!.id)

        if(!project){
            throw new ApiError("project not created",500)
        }   

        return res.status(201).json({
            status : "success",
            message : "project created successfully",
            data : project
        })
        
    }catch(error){
        next(error)
    }
}

export const getAllProjects = async(req:authRequest,res:Response,next:NextFunction)=>{
    try{
        const projects = await getAllProjectsService(req.user!.id)

        return res.status(200).json({
            status : "success",
            message : "projects fetched successfully",
            data : projects
        })
    }catch(error){
        next(error)
    }
}