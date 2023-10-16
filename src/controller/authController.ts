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
import admin from "../config/firebase-admin";
// utils
import {
  generateOTP,
  generateToken,
  isOTPIsExpired,
} from "../utils/commonFunctions";
import sendEmail from "./emailController";

const db = admin.firestore();
const usersCollection = db.collection("users");
//  to create a new user
const createUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { email, password, name, surName, phoneNumber } = req.body;
    // create a new user in db
    const id = generatePassword(10, false);
    // salt a password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = generateOTP(6);

    await usersCollection.doc(id).set({
      id,
      name,
      surName,
      email,
      phoneNumber,
      password: hashedPassword,
      verified: false,
      otp,
      otp_expires: new Date(),
    });

    // send otp in mail
    const sendOTP = `Hi Please Verify your account. your otp is ${otp}`;
    const dataToSendEmail = {
      html: sendOTP,
      to: email,
      text: "Hi, there",
      subject: "Verify Password Link",
    };
    sendEmail(dataToSendEmail);

    res.status(STATUS.success).send({ message: SUCCESS.otp_send });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(STATUS.server).send({ error: ERRORS.serverError });
  }
});
// to verify email address
const verifyOTP = asyncHandler(async (req: Request, res: Response) => {
  const { id, otp } = req.body;
  const userData = usersCollection.doc(id);
  const getUser = await userData.get();
  const data = getUser.data();
  // checking is code expires or not 10 mints after generating code expires
  if (isOTPIsExpired(data?.otp_expires, 10)) {
    res?.status(STATUS.badRequest).send({ error: ERRORS.expired_otp });
  }
  if (parseInt(data?.otp) !== parseInt(otp)) {
    res?.status(STATUS.badRequest).send({ error: ERRORS.invalidOTP });
  }
  await userData.update({
    verified: true,
  });
  const updatedData = await userData.get();
  const userDataWithoutSensitiveFields = updatedData.data();

  // Exclude fields that are sensitive
  if (userDataWithoutSensitiveFields) {
    delete userDataWithoutSensitiveFields.password;
    delete userDataWithoutSensitiveFields.otp_expires;
    delete userDataWithoutSensitiveFields.otp;
  }
  const token = generateToken(id);
  res.status(STATUS.success).send({ token, userDataWithoutSensitiveFields });
});

export { createUser, verifyOTP };
