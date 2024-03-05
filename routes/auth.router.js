import express from "express";
const router = express.Router();
import uservalidate from "../utils/validations/user.schema.js";
import authController from "../controllers/auth/auth.controller.js";
import loginvalidate from "../utils/validations/login.schema.js";
import tryCatch from "../utils/tryCatch.js";
import { limitLogin } from "../utils/rate_limit.js";

router.post(
    "/login",
    limitLogin,
    loginvalidate,
    tryCatch(authController.login)
);
router.post("/signup", uservalidate, tryCatch(authController.signup));

router.post("/token", loginLimiter, tryCatch(authController.refreshToken));

export default router;
