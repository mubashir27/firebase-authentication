import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import sendEmail from "../controller/emailController";
import { User } from "../types";
import { usersCollection } from "../config/firebase-admin";

const generateToken = (id: string) => {
  const tokenSecret = process.env.JWT_SECRET ?? "";
  return jwt.sign({ id }, tokenSecret, { expiresIn: "1d" });
};

const generateOTP = (OTP_LENGTH: number) => {
  const OTP = otpGenerator.generate(OTP_LENGTH, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  return OTP;
};

function isOTPIsExpired(
  otpCreatedAt: { _seconds: number; _nanoseconds: number },
  expiryMinutes: number
): boolean {
  console.log("otpCreatedAt", otpCreatedAt);
  const currentTime = new Date();
  const otpCreationTime = new Date(
    otpCreatedAt?._seconds * 1000 + otpCreatedAt._nanoseconds / 1000000
  ); // Convert Firestore Timestamp to JavaScript Date
  const expirationTime = new Date(
    otpCreationTime.getTime() + expiryMinutes * 60000
  );

  return currentTime > expirationTime;
}

const sendOTP = (email: string, otp: number) => {
  // send otp in mail
  console.log("sendOTP", email, otp);
  const dataToSendEmail = {
    html: `Hi Please Verify your account. your otp is ${otp}`,
    to: email,
    text: "Hi, there",
    subject: "Verify Password Link",
  };
  sendEmail(dataToSendEmail);
};

const getUserDataWithoutSensitiveFields = (user: User) => {
  if (!user) {
    return null;
  }
  const { password, otp_expires, otp, ...userData } = user;
  return userData;
};

const getUserDataFromDocument = async (email: string) => {
  const documentedUser = await usersCollection
    .where("email", "==", email)
    .get();

  return documentedUser.docs[0]?.data();
};

const sendVerificationCode = async (user: { id: string; email: string }) => {
  const otp = generateOTP(6);
  const userToUpdate = usersCollection.doc(user?.id);
  await userToUpdate?.update({
    otp,
    otp_expires: new Date(),
  });
  sendOTP(user?.email, parseInt(otp));
};

export {
  generateToken,
  generateOTP,
  isOTPIsExpired,
  sendOTP,
  getUserDataWithoutSensitiveFields,
  getUserDataFromDocument,
  sendVerificationCode,
};
