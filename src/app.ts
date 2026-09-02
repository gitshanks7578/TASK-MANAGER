import express from "express";
import cookieParsor from "cookie-parser"
import authRouter from "./routes/auth.routes.js";
import errorHandler from "./middleware/errorHandler.js";
import projectRouter from "./routes/project.routes.js";
import taskRouter from "./routes/task.routes.js";
import {prisma} from "./db/db.js"
const app =  express();

app.use(express.json())


app.use(cookieParsor())



app.get("/health",async(req,res)=>{
    await prisma.$queryRaw`SELECT 1`
    res.send("health check")
})

app.use("/api/auth",authRouter)
app.use("/api",projectRouter)
app.use("/api",taskRouter)



app.use(errorHandler)
export default app;