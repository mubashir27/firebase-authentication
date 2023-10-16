import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";

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
export { generateToken, generateOTP, isOTPIsExpired };
