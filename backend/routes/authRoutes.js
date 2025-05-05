/**
 * @fileoverview Authentication Routes
 * @module routes/authRoutes
 * @description Defines API endpoints for user authentication (sign-up, sign-in, and sign-out).
 */

const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/authController");

const router = express.Router();

/**
 * @route POST /auth/signup
 * @description Registers a new user.
 * @access Public
 */
router.post("/signup", registerUser);

/**
 * @route POST /auth/signin
 * @description Authenticates a user and sets JWT in cookies.
 * @access Public
 */
router.post("/signin", loginUser);

/**
 * @route GET /auth/signout
 * @description Logs out the user by clearing the JWT cookie.
 * @access Public
 */
router.get("/signout", logoutUser);

module.exports = router;
