import type {Request,Response,NextFunction} from "express"
import ApiError from "../utils/apiError.js"


const errorHandler = (err: ApiError | Error,req: Request,res: Response,next: NextFunction)=>{
   const statusCode = err instanceof ApiError ? err.statusCode : 500
   const message = err.message || "internal server error"

   res.status(statusCode).json({
    success:false,
    message
   })
}

// err.stack for exact debug when ur lost 
export default errorHandler