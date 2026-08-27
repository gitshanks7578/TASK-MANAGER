import type { Request, Response, NextFunction } from "express"
import ApiError from "../utils/apiError.js"
import { prisma } from "../db/db.js"
import type { authRequest } from "../middleware/verifyjwt.js"


export const updateTask = async(req:authRequest,res:Response,next:NextFunction) =>{
    try {
        
    } catch (error) {
        next(error)
    }
}