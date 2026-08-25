import express from "express"
import app from "./app.js"

const PORT = process.env.PORT || 3000
console.log("hello")
app.listen(PORT,()=>{
    console.log("server is running successfully")
})