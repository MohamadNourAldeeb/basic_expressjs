import sendingMail from "./emails.js";
import { addToRedisCache } from "./redis_cache.js";

import crypto from "crypto";
export const sendCode = async (username, email) => {
    const verifiedCode = crypto.randomInt(100000, 999999).toString();
    addToRedisCache(email, verifiedCode, 3 * 60);
    // store the verifiedCode for 3 minutes
    await sendingMail({
        from: process.env.email,
        to: email,
        subject: "Account Verification Link",
        name: username,
        verifiedCode,
    });
};
