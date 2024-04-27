import { StatusCodes } from "http-status-codes";

import { enumTypeInput as type } from "../constants/enums.js";

export const validate = (schema, typeSchema) => {
  let result = false;
  return (req, res, next) => {
    switch (typeSchema) {
      //validate body
      case type.body:
        result = schema.validate(req.body);
        break;
      ///validate query
      case type.query:
        result = schema.validate(req.query);
        break;
      ///validate params
      case type.params:
        result = schema.validate(req.params);
        break;
    }
    if (result.error) {
      const { details } = result.error;
      const message = details.map((i) => i.message).join(" , ");
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: message,
      });
    }
    next();
  };
};
