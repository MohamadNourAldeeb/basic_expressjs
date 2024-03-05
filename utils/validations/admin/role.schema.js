import Joi from "joi";

const schema = Joi.object({
    role_name: Joi.string().required().min(2).max(50),
    permissions: Joi.array().items(Joi.number().integer().min(1).max(1e7)),
});

const roleValidate = (req, res, next) => {
    const result = schema.validate(req.body);
    if (result.error) {
        res.status(400).send(result.error.message);
    } else {
        next();
    }
};

export default roleValidate;
