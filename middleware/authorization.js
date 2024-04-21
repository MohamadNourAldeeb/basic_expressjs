import dotenv from "dotenv";
import CustomError from "../utils/custom_error.js";
import { StatusCodes } from "http-status-codes";
import { ACCESS_DENIED } from "../utils/constants/error_code.js";
import { setRoleAndRestrictionCache } from "../utils/set_cash.js";
import { getFromRedisCache } from "../utils/redis_cache.js";
dotenv.config({ path: `./.env` });
const authorization = (action) => {
  return async (req, res, next) => {
    try {
      const { userId, userName, roleId, userExtPerm, deviceId } = req.user;

      let fromCache = await getFromRedisCache(`role:${roleId}`);

      fromCache = JSON.parse(fromCache);
      if (!fromCache) {
        await setRoleAndRestrictionCache();
        let fromCache = await getFromRedisCache(
            `role:${roleId}`
        );
        fromCache = JSON.parse(fromCache);

        if (!fromCache)
        throw new CustomError(
            ACCESS_DENIED,
            "An error has occurred, please re-login",
            StatusCodes.UNAUTHORIZED
        );
    } 
    if (userExtPerm?.length && userExtPerm.includes(action))
        return  next();
    if (!fromCache.permissions.includes(action))
    throw new CustomError(
        ACCESS_DENIED,
        "Access denied / unauthorized request",
        StatusCodes.UNAUTHORIZED
    );
      next();
    } catch (error) {
      return next(error);
    }
  };
};

export default authorization;
