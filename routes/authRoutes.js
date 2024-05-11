import { Router } from "express";
import signUpController, {
  EmailVerification,
} from "../controller/auth/signUpController.js";
import loginController from "../controller/auth/loginController.js";
import forgetPassword from "../controller/auth/forgetpasswordController.js";
import newPassword from "../controller/auth/newPasswordConstroller.js";
const authRoutes = Router();
authRoutes.post("/login", loginController);
authRoutes.post("/register", signUpController);
authRoutes.post("/email-verification", EmailVerification);
authRoutes.post("/forget-password", forgetPassword);
authRoutes.post("/new-password", newPassword);

export default authRoutes;
