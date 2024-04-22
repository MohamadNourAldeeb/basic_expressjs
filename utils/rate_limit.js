import { StatusCodes } from "http-status-codes";
import rateLimit from "express-rate-limit";

export const limit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10000,
    standardHeaders: true, // Return rate limit info in the RateLimit-* headers
    // legacyHeaders: false, // Disable the X-RateLimit-* headers,
    statusCode: StatusCodes.TOO_MANY_REQUESTS, //status code response
    // skipSuccessfulRequests: false,
    message: {
        success: false,
        error: "Too many requests from this IP, please try again after 15 minutes :) ",
        // data: {},
    },
});
export const limitSendCode = rateLimit({
    windowMs: 3 * 60 * 1000,
    max: 5,
    standardHeaders: true, // Return rate limit info in the RateLimit-* headers
    // legacyHeaders: false, // Disable the X-RateLimit-* headers,
    statusCode: StatusCodes.TOO_MANY_REQUESTS, //status code response
    // skipSuccessfulRequests: false,
    message: {
        success: false,
        error: "You have sent the verification code a lot, please wait 3 minutes and try again",
        // data: {},
    },
});

export const limitLogin = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 50,
    standardHeaders: true, // Return rate limit info in the RateLimit-* headers
    // legacyHeaders: false, // Disable the X-RateLimit-* headers,
    statusCode: StatusCodes.TOO_MANY_REQUESTS, //status code response
    // skipSuccessfulRequests: false,
    message: {
        success: false,
        error: "Too many requests from this IP, please try again after 2 minutes :)",
        // data: {},
    },
});
