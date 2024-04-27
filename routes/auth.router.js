import express from "express";
const router = express.Router();
import uservalidate from "../utils/validations/user.schema.js";
import authController from "../controllers/auth/auth.controller.js";
import tryCatch from "../utils/tryCatch.js";
import { limitLogin, limitSendCode } from "../utils/rate_limit.js";
import authentication from "../middleware/authentication.js";
import { validate } from "../utils/validations/validation.js";

import { schema } from "../utils/validations/schema/auth.schema.js";
import { enumTypeInput as type } from "../utils/constants/enums.js";

router.post(
    "/login",
    limitLogin,
    validate(schema.logIn, type.body),
    tryCatch(authController.login)
);
router.post("/signup", uservalidate, tryCatch(authController.signup));
router.post("/verification/:email", tryCatch(authController.verification));
router.post("/google", tryCatch(authController.google));
router.post(
    "/refresh_token",
    authentication,
    tryCatch(authController.refreshToken)
);
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
router.post(
    "/send_code/:email",
    limitSendCode,
    tryCatch(authController.send_code)
);
export default router;
