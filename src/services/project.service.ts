import { prisma } from "../db/db.js"
import ApiError from "../utils/apiError.js"
import { createTaskSchema, getTasksInProjectSchema } from "../validator/project.validator.js"
import { z } from "zod"
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
        where: {
            userId_projectId: {
                userId: existingMember.id,
                projectId: projectID
            }
        }
    })
    if (alreadyMember) {
        throw new ApiError("this member already exists in the project", 409)
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

export const deleteProjectService = async (projectID: string, userID: string) => {
    const user = await prisma.projectMember.findUnique({
        where: {
            userId_projectId: {
                userId: userID,
                projectId: projectID
            }
        }
    })

    if (user?.role !== "OWNER") {
        throw new ApiError("unauthorized action | only owner can delete project", 403)
    }

    const deleteproject = await prisma.project.delete({
        where: {
            id: projectID
        }
    })

    return deleteproject
}


export const createTaskService = async (projectID: string, creatorID: string, data: z.infer<typeof createTaskSchema>) => {

    // Check whether creator is a member of the project
    const creator = await prisma.projectMember.findUnique({
        where: {
            userId_projectId: {
                userId: creatorID,
                projectId: projectID
            }
        }
    })

    if (!creator) {
        throw new ApiError(
            "you are not a member of this project",
            403
        )
    }

    // If an assignee was provided, make sure they exist
    if (data.assigneeId) {

        const assignee = await prisma.projectMember.findUnique({
            where: {
                userId_projectId: {
                    userId: data.assigneeId,
                    projectId: projectID
                }
            }
        })

        if (!assignee) {
            throw new ApiError(
                "assignee is not a member of this project",
                400
            )
        }
    }

    const task = await prisma.task.create({
        data: {
            title: data.title,
            description: data.description ?? null,
            priority: data.priority,
            dueDate: data.dueDate ?? null,

            project: {
                connect: {
                    id: projectID
                }
            },

            creator: {
                connect: {
                    id: creatorID
                }
            },

            ...(data.assigneeId && {
                assignee: {
                    connect: {
                        id: data.assigneeId
                    }
                }
            })
        }
    })

    return task
}


export const getTasksInProjectService = async (project_id: string, query: z.infer<typeof getTasksInProjectSchema>) => {
    const skip = (query.page - 1) * query.limit;

    //array destrcuturing because promise.all returns an array and we used it to get both tasks and count in one process
    const [tasks, total] = await Promise.all([
        prisma.task.findMany({
            where: {
                projectId: project_id,


                ...(query.priority && {
                    priority: query.priority,
                }),


                ...(query.status && {
                    status: query.status
                }),
            },
            skip,
            take: query.limit,
            orderBy: {
                [query.sortBy]: query.order
            }
        }),

        prisma.task.count({
            where: {
                projectId: project_id,


                ...(query.priority && {
                    priority: query.priority,
                }),


                ...(query.status && {
                    status: query.status
                }),
            }
        })


    ])




    return {
        tasks,
        total,
        pagination : {
            limit : query.limit,
            page : query.page
        }
    }
}