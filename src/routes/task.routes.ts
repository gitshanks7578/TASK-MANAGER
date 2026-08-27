import express from "express";
import { verify } from "../middleware/verifyjwt.js";
import { updateTask } from "../controllers/task.controller.js";

const taskRouter = express.Router()

taskRouter.patch("/tasks/:id",updateTask)

export default taskRouter;