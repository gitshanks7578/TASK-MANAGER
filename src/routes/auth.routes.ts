import express from "express";
import {register, login,logout} from "../controllers/auth.controller.js"
import { verify } from "../middleware/verifyjwt.js";
const authRouter = express.Router();

authRouter.post("/register",register)
authRouter.post("/login",login)
authRouter.post("/logout",verify,logout)
export default authRouter;