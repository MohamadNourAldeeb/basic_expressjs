import dotenv from "dotenv";
import { verifyToken } from "../utils/jwt.js";
dotenv.config({ path: `./.env` });
const authentication = async (req, res, next) => {
    try {
        let rawToken = req.headers.authorization;

        if (!rawToken) throw Error("  token لا يوجد ");

        if (rawToken.startsWith("Bearer"))
            rawToken = rawToken.replace("Bearer ", "");

        let decoded = verifyToken(rawToken, process.env.TOKEN_KEY);

        req.user = {
            userId: decoded.userId,
            userName: decoded.userName,
            roleId: decoded.roleId,
            userExtPerm: decoded.userExtPerm,
            deviceId: decoded.deviceId,
        };

        next();
    } catch (error) {
        return next(error);
    }
};

export default authentication;
