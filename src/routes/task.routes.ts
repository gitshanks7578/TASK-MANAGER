import express from "express";
import { verify } from "../middleware/verifyjwt.js";
import { deleteTask, updateTask } from "../controllers/task.controller.js";

const taskRouter = express.Router()

taskRouter.patch("/tasks/:id",verify,updateTask)
taskRouter.delete("/tasks/:id",verify,deleteTask)
export default taskRouter;