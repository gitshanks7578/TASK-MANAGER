import {prisma} from "../db/db.js"
import ApiError from "../utils/apiError.js"
import bcrypt from "bcrypt"
import jwt  from "jsonwebtoken"
export const registerService = async (name: string,email : string,password : string)=>{
    return await prisma.user.create({
        data : {
            name,
            email,
            passwordHash : password
        }
    })
}


export const loginService = async(email : string,password:string)=>{

       //check user exists
        const existingUser  = await prisma.user.findUnique({
            where : {
                email
            }
        })

        if(!existingUser){
            throw new ApiError("user not found",404)
        }

        //check password

        const comparePassword = await bcrypt.compare(password,existingUser.passwordHash)
        if(!comparePassword){
            throw new ApiError("invalid password",401)
        }


        //generate jwt token

        const accessToken = jwt.sign({
            userID : existingUser.id,
            email : existingUser.email
        },
         process.env.ACCESS_TOKEN_SECRET!,
        {expiresIn:"2h"}
    )

    return {
        accessToken,
        user : {
            id : existingUser.id,
            name : existingUser.name,
            email : existingUser.email
        }
    }
}