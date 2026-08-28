import express from "express";
import {register, login,logout} from "../controllers/auth.controller.js"
import { verify } from "../middleware/verifyjwt.js";
import { addMember, createProject, getAllProjects,getProjectById,deleteProjectById,createTaskInProject, getTasksInProject, getTaskSummary } from "../controllers/project.controller.js";
const projectRouter = express.Router();

projectRouter.post("/projects",verify,createProject)
projectRouter.get("/projects",verify,getAllProjects )
projectRouter.get("/projects/:id",verify,getProjectById)
projectRouter.post("/projects/:id/members",verify,addMember)
projectRouter.delete("/projects/:id",verify,deleteProjectById)
projectRouter.post("/projects/:id/tasks",verify,createTaskInProject)
projectRouter.get("/projects/:id/tasks",verify,getTasksInProject)
projectRouter.get("/projects/:id/summary",verify,getTaskSummary)
export default projectRouter;