import {prisma} from "../db/db.js"
import ApiError from "../utils/apiError.js"

export const createProjectService = async(name : string,description :string,ownerId:string) =>{
    return await prisma.project.create({
        data:{
            name,
            description,
            owner:{
                connect:{
                    id : ownerId
                }
            }
        }
    })
}

export const getAllProjectsService = async(ownerId:string)=>{
    return await prisma.project.findMany({
        where : {
            ownerId 
        }
    })
}