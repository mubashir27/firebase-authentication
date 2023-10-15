import asyncHandler from "express-async-handler";
import admin from "../config/firebase-admin-config";
import { Request, Response } from "express";

const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const createUser = await admin
    .auth()
    .createUser({ email, password, emailVerified: false, disabled: false });

  res.json(createUser);
});

export { createUser };
