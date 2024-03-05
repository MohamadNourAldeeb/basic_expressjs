import { StatusCodes } from "http-status-codes";
import CustomError from "../utils/custom_error.js";

const errorHandler = (error, req, res, next) => {
    if (error instanceof CustomError) {
        res.status(error.statusCode).send({
            success: false,
            message: error.message,
            errorCode: error.errorCode,
        });
    } else
        res.status(StatusCodes.BAD_REQUEST).send({
            success: false,
            message: error.message,
        });
};

export default errorHandler;
