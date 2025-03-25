import { Router } from "express";
import { signUp, signIn, signOut, requestPasswordReset, resetPassword } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/sign-up", signUp)
authRouter.post("/sign-in", signIn)
authRouter.post("/sign-out", signOut)

authRouter.post("/forgot-password", requestPasswordReset)
authRouter.post("/reset-password", resetPassword)

export default authRouter;