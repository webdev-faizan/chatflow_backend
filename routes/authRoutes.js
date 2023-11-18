import { Router } from "express";
import signInController from "../controller/auth/SignInController.js";
import loginController from "../controller/auth/loginController.js";

const authRoutes = Router();

authRoutes.post("/login", loginController);
authRoutes.post("/register", signInController);

export default authRoutes;
