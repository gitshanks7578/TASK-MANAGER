import express from "express";
import {register, login,logout} from "../controllers/auth.controller.js"
import { verify } from "../middleware/verifyjwt.js";
import { createProject, getAllProjects } from "../controllers/project.controller.js";
const projectRouter = express.Router();

projectRouter.post("/projects",verify,createProject)
projectRouter.get("/projects",verify,getAllProjects )


export default projectRouter;