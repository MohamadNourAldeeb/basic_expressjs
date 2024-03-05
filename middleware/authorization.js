import dotenv from "dotenv";
import { Role_Permissions } from "../models/index.js";
import CustomError from "../utils/custom_error.js";
import { StatusCodes } from "http-status-codes";
import { ACCESS_DENIED } from "../utils/constants/error_code.js";
dotenv.config({ path: `./.env` });
const authorization = (action) => {
    return async (req, res, next) => {
        try {
            const { userId, userName, roleId, userExtPerm, deviceId } =
                req.user;

            let userPerm = await Role_Permissions.findAll({
                raw: true,
                attributes: ["perm_id"],
                where: { role_id: roleId },
            });
            userPerm = userPerm.map((item) => item.perm_id);
            const mergedArray = [...new Set([...userPerm, ...userExtPerm])];

            if (!userPerm.length)
                throw new CustomError(
                    ACCESS_DENIED,
                    "يوجد خطأ في اسناد صلاحياتك",
                    StatusCodes.UNAUTHORIZED
                );
            if (!mergedArray.includes(action))
                throw new CustomError(
                    ACCESS_DENIED,
                    "ليس لديك الصلاحية لاستخدام هذا الرابط",
                    StatusCodes.UNAUTHORIZED
                );

            next();
        } catch (error) {
            return next(error);
        }
    };
};

export default authorization;
