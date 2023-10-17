import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { STATUS } from "../messages/statusCodes";
import { usersCollection } from "../config/firebase-admin";
import { ERRORS } from "../messages/errors";
import jwt from "jsonwebtoken";

const checkUserExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    let token = req.headers?.authorization.split(" ")[1];
    try {
      if (token) {
        const decode = jwt.verify(token, process.env.JWT_SECRET || "") as {
          id: string;
        };
        const user = await usersCollection.doc(decode.id);
        (req as any).user = user;
        next();
      }
    } catch (error) {
      res.status(STATUS.badRequest).send({ error: ERRORS.tokenNotFound });
    }
  } else {
    res.status(STATUS.badRequest).send({ error: ERRORS.tokenMissing });
  }
};

export { checkUserExists, checkSchemaError, checkUser, authMiddleware };
