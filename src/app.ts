import express from "express";
import cookieParsor from "cookie-parser"
import authRouter from "./routes/auth.routes.js";
import errorHandler from "./middleware/errorHandler.js";

const app =  express();

app.use(express.json())


app.use(cookieParsor())



app.get("/health",(req,res)=>{
    res.send("health check")
})

app.use("/api/auth",authRouter)



app.use(errorHandler)
export default app;