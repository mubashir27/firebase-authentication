import express from "express";
import { createUser } from "../controllers/authController";
import { signUpSchema } from "../middlewares/validations/authSchema";
import { checkSchemaError } from "../middlewares/authMiddleWare";

const router = express.Router();

router.post("/register", signUpSchema, checkSchemaError, createUser);

module.exports = router;
