import type {Request, Response, NextFunction} from "express"
import jwt from "jsonwebtoken"
import ApiError from "../utils/apiError.js"

export interface authRequest extends Request{
    user?:{
        id : string
        email : string,
    }
}

export const verify = async (req: authRequest, res: Response, next: NextFunction) => {
    try{
        const token = req?.cookies.accessToken || req.header("Authorization")?.replace("Bearer ","")
        if(!token){
            throw new ApiError("unauthorized access",401)
        }

        let decoded;
        try {
            
            decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET!) as {userID :string , email:string}
        } catch (error) {
            throw new ApiError("user is unauthenicated",401)
        }

        
        req.user = {
            id : decoded.userID,
            email : decoded.email
        }

        next()
    }catch(error){
        next(error)
    }
}