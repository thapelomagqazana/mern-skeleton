/**
 * @fileoverview Authentication Controller
 * @module controllers/authController
 * @description Handles user authentication, including sign-in, sign-up, and sign-out.
 */

import User from "../models/User.js";
import jwt from "jsonwebtoken";

/**
 * @function registerUser
 * @description Registers a new user in the database.
 * @param {Object} req - Express request object containing user details (name, email, password).
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response containing success message and user ID.
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = await User.create({ name, email, password });

    res.status(201).json({ message: "User registered successfully", userId: user._id });
  } catch (error) {
    console.error("❌ Registration Error:", error.message);
    res.status(400).json({ message: "Invalid user data" });
  }
};

/**
 * @function loginUser
 * @description Authenticates user login by verifying email and password. Sets JWT in cookies.
 * @param {Object} req - Express request object containing login credentials (email, password).
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response containing JWT token.
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and password is correct
    if (user && (await user.matchPassword(password))) {
      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

      // Set token as an HTTP-only cookie
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "strict",
        maxAge: 60 * 60 * 1000, // 1 hour
      });

      res.json({ message: "Login successful" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("❌ Login Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @function logoutUser
 * @description Logs out a user by clearing the JWT cookie.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response confirming logout.
 */
export const logoutUser = (req, res) => {
  try {
    // Clear the JWT cookie
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0), // Set expiration date to past to remove cookie
    });

    res.json({ message: "Successfully logged out" });
  } catch (error) {
    console.error("❌ Logout Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
