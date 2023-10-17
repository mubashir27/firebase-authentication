import express from "express";
import {
  createUser,
  verifyOTP,
  loginUser,
  forgotPassword,
  resetPassword,
  verifyForgotPasswordOTP,
  resendVerificationCode,
} from "../controller/authController";
import {
  authMiddleware,
  checkSchemaError,
  checkUser,
  checkUserExists,
} from "../middlewares/authMiddleware";
import {
  forgotPasswordSchema,
  signUpSchema,
  singInSchema,
  verificationSchema,
} from "../middlewares/validations/authSchema";

const router = express.Router();

router.post(
  "/register",
  signUpSchema,
  checkSchemaError,
  checkUserExists,
  createUser
);
router.post("/login", singInSchema, checkSchemaError, checkUser, loginUser);
router.post(
  "/verify",
  verificationSchema,
  checkSchemaError,
  checkUser,
  verifyOTP
);
router.post(
  "/forgot-password",
  forgotPasswordSchema,
  checkSchemaError,
  checkUser,
  forgotPassword
);

router.post(
  "/verify-forgot-password",
  verificationSchema,
  checkSchemaError,
  checkUser,
  verifyForgotPasswordOTP
);
router.post(
  "/reset-password",
  singInSchema,
  checkSchemaError,
  checkUser,
  authMiddleware,
  resetPassword
);
router.post(
  "/resend-verification",
  forgotPasswordSchema,
  checkSchemaError,
  checkUser,
  resendVerificationCode
);

module.exports = router;
