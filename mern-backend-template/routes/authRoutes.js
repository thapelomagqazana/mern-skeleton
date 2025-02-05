/**
 * @fileoverview Authentication Routes
 * @module routes/authRoutes
 * @description Defines API endpoints for user authentication (sign-up and sign-in).
 */

import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

/**
 * @route POST /auth/signup
 * @description Registers a new user
 * @access Public
 */
router.post("/signup", registerUser);

/**
 * @route POST /auth/signin
 * @description Authenticates a user and returns a JWT token
 * @access Public
 */
router.post("/signin", loginUser);

export default router;
