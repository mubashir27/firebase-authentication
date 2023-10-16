import express from "express";
import { createUser, verifyOTP } from "../controller/authController";
import {
  checkSchemaError,
  checkUser,
  checkUserExists,
} from "../middlewares/authMiddleware";
import { signUpSchema } from "../middlewares/validations/authSchema";

const router = express.Router();

router.post(
  "/register",
  signUpSchema,
  checkSchemaError,
  checkUserExists,
  createUser
);
router.post("/verify", checkUser, verifyOTP);

module.exports = router;
