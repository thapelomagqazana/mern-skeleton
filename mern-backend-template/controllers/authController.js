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
      let { name, email, password, role } = req.body;
  
      // Collect all missing fields instead of returning early
      let errors = [];
  
      if (!name) errors.push("Name is required");
      if (!email) errors.push("Email is required");
      if (!password) errors.push("Password is required");
  
      if (errors.length > 0) {
        return res.status(400).json({ message: errors.join(", ") });
      }

      // Set default role if not provided
      role = role ?? "user";

      // Ensure only valid roles are assigned
      const validRoles = ["user", "admin"];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role specified" });
      }

  
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      // Create new user
      const user = await User.create({ name, email, password, role });
  
      res.status(201).json({ message: "User registered successfully", userId: user._id });
    } catch (error) {
      // console.error("❌ Registration Error:", error);
  
      if (error.name === "ValidationError") {
        return res.status(400).json({ message: Object.values(error.errors).map(err => err.message).join(", ") });
      }
  
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
  
      let errors = [];
      if (!email) errors.push("Email is required");
      if (!password) errors.push("Password is required");
  
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailRegex.test(email.trim())) {
        errors.push("Please enter a valid email address");
      }
  
      // Reject emails longer than 255 characters
      if (email && email.trim().length > 255) {
        errors.push("Email must be at most 255 characters long");
      }
  
      // Reject emails with emojis
      if (email && /[\u{1F600}-\u{1F64F}]/u.test(email)) {
        errors.push("Please enter a valid email address");
      }
  
      // Reject emails with multiple consecutive dots
      if (email && email.includes("..")) {
        errors.push("Please enter a valid email address");
      }
  
      if (errors.length > 0) {
        return res.status(400).json({ message: errors.join(", ") });
      }
  
      const user = await User.findOne({ email: email.trim() });
      if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // Generate JWT token
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
  
      res.status(200).json({ message: "Login successful", token, user });
    } catch (error) {
      // console.error("❌ Login Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * @function logoutUser
 * @description Logs out a user by clearing JWT and validating the request token.
 * @route GET /auth/signout
 * @access Protected
 */
export const logoutUser = async (req, res) => {
    try {
      const token = req.headers.authorization?.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1]
        : null;
  
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }
  
      try {
        // Verify token before proceeding
        jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }
  
      // Clear the cookie (for session-based authentication)
      res.clearCookie("jwt");
  
      return res.status(200).json({ message: "User signed out successfully" });
    } catch (error) {
      console.error("Signout Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  