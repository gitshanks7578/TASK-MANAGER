import express from "express";
import cookieParsor from "cookie-parser"

const app =  express();

app.use(express.json())


app.use(cookieParsor())



app.get("/health",(req,res)=>{
    res.send("health check")
})



export default app;