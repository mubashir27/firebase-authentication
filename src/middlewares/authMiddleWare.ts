import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { STATUS } from "../messages/statusCodes";

//checking is there any error of schema i.e is the input paramter coming are valid or not
const checkSchemaError = (req: Request, res: Response, next: NextFunction) => {
  // valiating error
  const errors = validationResult(req);
  console.log("CHECK_SCHEMA_ERROR", errors.array());
  const array = errors.array();
  if (!errors.isEmpty()) {
    return res
      .status(STATUS.badRequest)
      .json({ errors: true, message: array[0]?.msg });
  }
  return next(); // moving to the next function
};
export { checkSchemaError };
