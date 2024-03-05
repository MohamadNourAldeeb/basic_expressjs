import Joi from "joi";

const schema = Joi.object({
    perm_mod: Joi.string().required().min(2).max(50),
    perm_desc: Joi.string().required().min(2).max(100),
});

const permissionValidate = (req, res, next) => {
    const result = schema.validate(req.body);
    if (result.error) {
        res.status(400).send(result.error.message);
    } else {
        next();
    }
};

export default permissionValidate;
