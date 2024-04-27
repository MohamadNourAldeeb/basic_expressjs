import csurf from "csurf";
import { StatusCodes } from "http-status-codes";
export let csurfProtection = csurf({
    cookie: {
        key: "cheaper-csrf",
        secure: true,
        sameSite: "strict",
        httpOnly: true,
    },
    ignoreMethods: ["GET", "HEAD", "OPTIONS"],
    sessionKey: process.env.CSRF_SESSION_SECRET,
});

let authPattern = /^\/auth/;
export default (req, res, next) => {
    if (req.method === "GET" || authPattern.test(req.url)) {
        return next();
    }
    csurfProtection(req, res, (err) => {
        if (err) {
            return res.status(StatusCodes.FORBIDDEN).json({
                success: false,
                msg: "Invalid CSRF token",
            });
        }
        return next();
    });
};
