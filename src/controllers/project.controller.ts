import type { Request, Response, NextFunction } from "express"
import ApiError from "../utils/apiError.js"
import { prisma } from "../db/db.js"
import type { authRequest } from "../middleware/verifyjwt.js"
import { addMemberSchema, createProjectSchema,createTaskSchema, getTasksInProjectSchema } from "../validator/project.validator.js"
import { addMemberService, createProjectService,deleteProjectService,getAllProjectsService ,createTaskService, getTasksInProjectService,getTaskSummaryService} from "../services/project.service.js"




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

export const getProjectById = async(req:authRequest,res:Response,next:NextFunction)=>{
    try{
        const {id} = req.params
        if ( typeof id !== "string"){
            throw new ApiError("invalid project id",400)
        }
        const listOfProjects = await prisma.project.findMany({
            where : {
                id
            }
        })

        return res.status(200).json({
            status : "success",
            message : "projects retrieved successfully",
            data : listOfProjects
        })
    }catch(error){
        next(error)
    }
}

export const addMember = async(req:authRequest,res : Response,next : NextFunction)=>{
    try {
        const result = addMemberSchema.safeParse(req.body)
        const {project_id} = req.params
        if(typeof project_id !== "string"){
            throw new ApiError("invalid project ID",400)
        }
        if(!result.success){
           const message = result.error.issues.map((issue)=>issue.message).join(", ")
           throw new ApiError(`invalid format : ${message}`,400)
        }

        const user = await addMemberService(project_id,result.data.email,req.user!.id)

        return res.status(200).json({
            success : true,
            message : "member added succesfully",
            data : user
        })
        
    } catch (error) {
        next(error)
    }
}
export const deleteProjectById = async(req:authRequest,res : Response,next:NextFunction) =>{
    try {
        const {project_id} = req.params
        if(typeof project_id !== "string"){
            throw new ApiError("invalid project ID ",400)
        }
        const deletedProject = await deleteProjectService(project_id,req.user!.id)

        return res.status(200).json({
            success : true,
            message : "project deleted successfully",
            data : deletedProject
        })
    } catch (error) {
        next(error)
    }
}

export const createTaskInProject = async (req: authRequest,res: Response,next: NextFunction) => {
    try {
        const { project_id } = req.params

        if (typeof project_id !== "string") {
            throw new ApiError("invalid project ID", 400)
        }

        const result = createTaskSchema.safeParse(req.body)

        if (!result.success) {
            const message = result.error.issues
                .map((issue) => issue.message)
                .join(", ")

            throw new ApiError(
                `invalid request body: ${message}`,
                400
            )
        }

        const task = await createTaskService(
            project_id,
            req.user!.id,
            result.data
        )

        return res.status(201).json({
            success: true,
            message: "task created successfully",
            data: task
        })
    } catch (error) {
        next(error)
    }
}


export const getTasksInProject = async(req:authRequest,res:Response,next:NextFunction)=>{
    try {
        const {project_id} = req.params
        if(typeof project_id !== "string"){
            throw new ApiError("invalid project id",400);
        }

        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10

        const status = req.query.status as string
        const priority = req.query.priority as string

        const sortBy = (req.query.sortBy as string) || "createdAt"
        const order = (req.query.order as "asc" | "desc") || "desc"

        const validationTest = getTasksInProjectSchema.safeParse(req.query)

        if(!validationTest.success){
            throw new ApiError("invalid query parameters",400);
        }

        const tasks = await getTasksInProjectService(project_id,validationTest.data);

        return res.status(200).json({
            success : true,
            message : "task retrieved successfully",
            data : tasks
        })
    } catch (error) {
        next(error)
    }
}


export const getTaskSummary = async (req:authRequest,res:Response,next:NextFunction) =>{
    try {
        const {project_id} = req.params
        if(typeof project_id !== "string"){
            throw new ApiError("invalid project id",400)
        }

        const summary = await getTaskSummaryService(project_id)

        return res.status(200).json({
            success:true,
            message : "summary retrieved successfully",
            data : summary
        })
    } catch (error) {
        next(error)
    }
}