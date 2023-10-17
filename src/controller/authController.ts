// installed libraries
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import generatePassword from "password-generator";
// messages
import { ERRORS } from "../messages/errors";
import { STATUS } from "../messages/statusCodes";
import { SUCCESS } from "../messages/success";
// config
import { usersCollection } from "../config/firebase-admin";
// utils
import {
  generateOTP,
  generateToken,
  getUserDataFromDocument,
  getUserDataWithoutSensitiveFields,
  isOTPIsExpired,
  sendOTP,
  sendVerificationCode,
} from "../utils/commonFunctions";
// types
import { User } from "../types";

//  to create a new user
const createUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    // create a id for a new user in db
    const id = generatePassword(10, false);
    // create a salt and hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // to generate otp
    const otp = generateOTP(6);
    // to set user data in db
    await usersCollection.doc(id).set({
      id,
      name,
      email,
      password: hashedPassword,
      verified: false,
      otp,
      otp_expires: new Date(),
    });

    // send otp in mail
    sendOTP(email, parseInt(otp));
    res.status(STATUS.success).send({ message: SUCCESS.otp_send });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(STATUS.server).send({ error: ERRORS.serverError });
  }
});
// to verify email address
const verifyOTP = asyncHandler(async (req: Request, res: Response) => {
  const { otp, email } = req.body;
  // to get all data of user with specific email
  const user = await getUserDataFromDocument(email);
  const userData = usersCollection.doc(user?.id);
  // checking is code expires or not 10 mints after generating code expires
  if (isOTPIsExpired(user?.otp_expires, 10)) {
    res?.status(STATUS.badRequest).send({ error: ERRORS.expired_otp });
  }
  // check if otp are not same
  if (parseInt(user?.otp) !== parseInt(otp)) {
    res?.status(STATUS.badRequest).send({ error: ERRORS.invalidOTP });
  }
  await userData.update({
    verified: true,
  });
  res.status(STATUS.success).send({ message: SUCCESS.account_verified });
});

// to verify forgot password
const verifyForgotPasswordOTP = asyncHandler(
  async (req: Request, res: Response) => {
    const { otp, email } = req.body;
    // to get all data of user with specific email
    const user = await getUserDataFromDocument(email);
    if (isOTPIsExpired(user?.otp_expires, 10)) {
      res?.status(STATUS.badRequest).send({ error: ERRORS.expired_otp });
    }
    // check if otp are not same
    if (parseInt(user?.otp) !== parseInt(otp)) {
      res?.status(STATUS.badRequest).send({ error: ERRORS.invalidOTP });
    }
    res.status(STATUS.success).send({ message: SUCCESS.verified });
  }
);

// login user
// 0. check email exists or not if not return error - done by middleware
const loginUser = asyncHandler(async (req: Request, res: Response) => {
  // 1. check password is same if not return error
  // CONSTANTS
  const { email, password } = req.body;
  const user = await getUserDataFromDocument(email);
  // 2. to check passwords
  const matched = await bcrypt.compare(password, user?.password);
  if (!matched) {
    res.status(STATUS.badRequest).send({ error: ERRORS.passwordShouldBeSame });
  }
  // 3. if email and password are same and not verified provide a verification code in mail
  if (matched && !user?.verified) {
    sendVerificationCode(user as User);
    res.status(STATUS.success).send({ message: SUCCESS.otp_send });
  }
  // 4. check if email password and verification all are okay then create a token and send details of user
  const dataToDisplay = getUserDataWithoutSensitiveFields(user as User);
  const token = generateToken(user?.id);
  res.status(STATUS.success).send({ token, ...dataToDisplay });
});
// reset password / forgot password
const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await getUserDataFromDocument(email);
  sendVerificationCode(user as User);
  const token = generateToken(user?.id);
  res.status(STATUS.success).send({ token, message: SUCCESS.otp_send });
});

const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  // CONSTANTS
  const { email, password } = req.body;
  const user = await getUserDataFromDocument(email);
  const userToUpdate = usersCollection.doc(user?.id);
  // create a salt and hashed password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  await userToUpdate?.update({
    password: hashedPassword,
  });
  res.status(STATUS.success).send({ message: SUCCESS.password_updated });
});

const resendVerificationCode = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await getUserDataFromDocument(email);
    sendVerificationCode(user as User);
    res.status(STATUS.success).send({ message: SUCCESS.otp_send });
  }
);

export {
  createUser,
  verifyOTP,
  loginUser,
  forgotPassword,
  resetPassword,
  verifyForgotPasswordOTP,
  resendVerificationCode,
};
