import Joi from "joi";
import { enumGender } from "../../constants/enums.js";
export const schema = {
  //login
  logIn: Joi.object({
    username: Joi.string()
      .trim()
      .pattern(/[a-zA-Z]+[a-zA-Z0-9\_\.]*$/)
      .min(3)
      .max(30)
      .required(),
    password: Joi.string().required().min(8).max(50),
  }),
  signup: Joi.object({
    name: Joi.string().required().min(2).max(50).trim(),
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
  }),
};
