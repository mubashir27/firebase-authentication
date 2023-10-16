import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { STATUS } from "../messages/statusCodes";
import admin from "../config/firebase-admin";
import { ERRORS } from "../messages/errors";

const db = admin.firestore();
const usersCollection = db.collection("users");

const checkUserExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // CONSTANTS
  try {
    // checking if the user already exists
    const user = await usersCollection
      .where("email", "==", req.body.email)
      .get();
    if (!user.empty) {
      res.status(STATUS.badRequest).send({ error: ERRORS.user_already_exists });
    } else {
      return next();
    }
  } catch (error) {
    return null;
  }
};

const checkUser = async (req: Request, res: Response, next: NextFunction) => {
  // CONSTANTS
  try {
    // checking if the user already exists
    const user = await usersCollection
      .where("email", "==", req.body.email)
      .get();
    if (!user.empty) {
      return next();
    } else {
      res.status(STATUS.badRequest).send({ error: ERRORS.user_not_found });
    }
  } catch (error) {
    return null;
  }
};

//checking is there any error of schema i.e is the input parameter coming are valid or not
const checkSchemaError = (req: Request, res: Response, next: NextFunction) => {
  // validating error
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
export { checkUserExists, checkSchemaError, checkUser };
