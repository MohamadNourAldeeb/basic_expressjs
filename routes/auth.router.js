import express from "express";
const router = express.Router();
import uservalidate from "../utils/validations/user.schema.js";
import authController from "../controllers/auth/auth.controller.js";
import loginvalidate from "../utils/validations/login.schema.js";
import tryCatch from "../utils/tryCatch.js";
import { limitLogin, limitSendCode } from "../utils/rate_limit.js";
import authentication from "../middleware/authentication.js";

router.post(
    "/login",
    limitLogin,
    loginvalidate,
    tryCatch(authController.login)
);
router.post("/signup", uservalidate, tryCatch(authController.signup));
router.post("/verification/:email", tryCatch(authController.verification));
router.post("/google", tryCatch(authController.google));
router.post("/token", tryCatch(authController.refreshToken));
router.post(
    "/reset_password",
    authentication,
    tryCatch(authController.reset_password)
);
router.post(
    "/resend_code/:email",
    limitSendCode,
    tryCatch(authController.resend_code)
);
export default router;
