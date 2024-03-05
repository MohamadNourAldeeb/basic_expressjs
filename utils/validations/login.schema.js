import Joi from "joi";
import { StatusCodes } from "http-status-codes";
const schema = Joi.object({
    username: Joi.string()
        .trim()
        .pattern(/[a-zA-Z]+[a-zA-Z0-9\_\.]*$/)
        .min(3)
        .max(30)
        .required(),
    password: Joi.string().required().min(8).max(50),
});

const loginvalidate = (req, res, next) => {
    const result = schema.validate(req.body);
    if (result.error) {
        res.status(400).send(result.error.message);
    } else {
        next();
    }
};

export default loginvalidate;
