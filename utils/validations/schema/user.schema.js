import Joi from "joi";
import { enumGender } from "../constants/enums.js";
export const schema = {
  body: Joi.object({
    full_name: Joi.string().required().min(2).max(50).trim(),
    gender: Joi.string()
      .valid(...Object.values(enumGender))
      .required(),
    phoneNumber: Joi.string()
      .trim()
      .required()
      .pattern(/^(09)(\d{8})$/),
    username: Joi.string()
      .trim()
      .pattern(/[a-zA-Z]+[a-zA-Z0-9\_\.]*$/)
      .min(3)
      .max(30)
      .required(),
    password: Joi.string().required().min(8).max(50),
    email: Joi.string().email(),
    role_id: Joi.number().integer().min(1).max(3),
    customPermissions: Joi.array().items(
      Joi.number().integer().min(1).max(1e7)
    ),
  }),
  params: Joi.object({
    id: Joi.number().integer().required().min(1).max(1e7),
  }),
  query: Joi.object({}),
  empty: Joi.object({}),
};
