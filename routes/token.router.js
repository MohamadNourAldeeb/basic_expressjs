import express from "express";
const router = express.Router();
import authController from "../controllers/auth.controller.js";
import loginvalidate from "../utils/validations/login.schema.js";
import tryCatch from "../utils/tryCatch.js";
import rateLimit from "express-rate-limit";
const loginLimiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 15 minutes
    max: 30, // limit each IP to 200 requests per windowMs
    message: {
        success: false,
        message: "تقوم بارسال نفس الطلب بشكل متكرر , حاول لاحقا ",
    },
});
router.post(
    "/login",
    loginLimiter,
    loginvalidate,
    tryCatch(authController.login)
);

export default router;
