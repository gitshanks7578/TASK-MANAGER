import { prisma } from "../db/db.js"
import ApiError from "../utils/apiError.js"

export const createProjectService = async (name: string, description: string, ownerId: string) => {
    const project = await prisma.project.create({
        data: {
            name,
            description,
            owner: {
                connect: {
                    id: ownerId
                }
            }
        }
    })


    const project_member = await prisma.projectMember.create({
        data: {
            user: {
                connect: {
                    id: ownerId
                }
            },
            project: {
                connect: {
                    id: project.id
                }
            },
            role: "OWNER"
        }
    })


    return project;
}

export const getAllProjectsService = async (ownerId: string) => {
    return await prisma.project.findMany({
        where: {
            ownerId
        }
    })
}

export const addMemberService = async (projectID: string, memberEmail: string, ownerID: string) => {

    const user = await prisma.projectMember.findUnique({
        where: {
            userId_projectId: {
                userId: ownerID,
                projectId: projectID
            }
        }
    })
    if (!user) {
        throw new ApiError("you are not a member of this project", 403)
    }
    if (user.role !== "OWNER") {
        throw new ApiError("unauthorized action | only owner can add members", 403)
    }

    const existingMember = await prisma.user.findUnique({
        where: {
            email: memberEmail
        }
    })
    if (!existingMember) {
        throw new ApiError("member doesnt exist", 400)
    }

     const alreadyMember = await prisma.projectMember.findUnique({
        where : {
            userId_projectId:{
                userId : existingMember.id,
                projectId : projectID
            }
        }
    })
    if(alreadyMember){
        throw new ApiError("this member already exists in the project",409)
    }

    
    const member = await prisma.projectMember.create({
        data: {
            user: {
                connect: {
                    id: existingMember.id
                }
            },
            project: {
                connect: {
                    id: projectID
                }
            }
        }
    })

    return member;
}