import express from "express";
import {register, login,logout} from "../controllers/auth.controller.js"
import { verify } from "../middleware/verifyjwt.js";
import { createProject, getAllProjects,getProjectById } from "../controllers/project.controller.js";
const projectRouter = express.Router();

projectRouter.post("/project",verify,createProject)
projectRouter.get("/project",verify,getAllProjects )
projectRouter.get("/project/:id",verify,getProjectById)

export default projectRouter;