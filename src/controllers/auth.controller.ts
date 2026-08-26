import type { Request, Response, NextFunction } from "express"
import ApiError from "../utils/apiError.js"
import { registerSchema, loginSchema } from "../validator/auth.validator.js"
import bcrypt from "bcrypt"
import { registerService, loginService } from "../services/auth.service.js"
import type { authRequest } from "../middleware/verifyjwt.js"
import { prisma } from "../db/db.js"
import jwt from "jsonwebtoken"

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = registerSchema.safeParse(req.body)
        if (!result.success) {
            const message = result.error.issues.map((issue) => issue.message).join(", ")
            throw new ApiError(`invalid request body : ${message}`, 400)
        }
        const hashedpassword = await bcrypt.hash(result.data.password, 10)

        const user = await registerService(result.data.name, result.data.email, hashedpassword)

        if (!user) {
            throw new ApiError("user not created", 500)
        }

        return res.status(201).json({
            status: "success",
            message: "user created successfully",
            data: user
        })


    } catch (error) {
        next(error)
    }
}

export const login = async (req: authRequest, res: Response, next: NextFunction) => {
    try {
        const result = loginSchema.safeParse(req.body)
        if (!result.success) {
            const message = result.error.issues.map((issue) => issue.message).join(", ")
            throw new ApiError(`invalid request body : ${message}`, 400)
        }
        const loggedUser = await loginService(result.data.email, result.data.password)

        res.cookie("accessToken", loggedUser.accessToken, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 2 * 60 * 60 * 1000, // 15 min
        });

        await prisma.user.update({
            data: {
                accountStatus: "LOGGED_IN"
            },
            where : {
                email : result.data.email
            }
        })
        return res.status(200).json({
            status: "success",
            message: "user logged in successfully",
            data: loggedUser
        })


    } catch (error) {
        next(error)
    }
}


export const logout = async (req: authRequest, res: Response, next: NextFunction) => {
    try {
        const id = req.user!.id
        await prisma.user.update({
            data : {
                accountStatus : "LOGGED_OUT"
            },
            where:{
                id
            }
        })


        

        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        next(error)
    }
}