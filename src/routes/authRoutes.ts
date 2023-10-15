import express from "express";
import { createUser } from "../controllers/authController";

const router = express.Router();

router.post("/register", createUser);

module.exports = router;
