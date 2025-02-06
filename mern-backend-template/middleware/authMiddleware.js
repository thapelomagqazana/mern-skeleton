/**
 * @fileoverview Authentication and Authorization Middleware
 * @module middleware/authMiddleware
 * @description Protects routes by verifying JWT tokens and authorizing users.
 */

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

// Load environment variables
dotenv.config();

/**
 * @function protect
 * @description Middleware to protect routes by verifying JWT authentication.
 * @param {Object} req - Express request object containing JWT token in the headers.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function to continue request processing.
 * @returns {void} Calls `next()` if authentication is successful, else returns an error response.
 */
export const protect = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = req.headers.authorization?.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null;

    // Check if a token exists
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the authenticated user and attach to request object (excluding password)
    req.user = await User.findById(decoded.id).select("-password");

    next(); // Continue to the next middleware/controller
  } catch (error) {
    // console.error("❌ Authentication Error:", error.message);
    res.status(401).json({ message: "Invalid token, authentication failed" });
  }
};

export const validateQueryParams = (req, res, next) => {
    if (req.query.page && isNaN(req.query.page) || Number(req.query.page) < 1) {
      return res.status(400).json({ message: "Invalid page number" });
    }
    if (req.query.search && /[<>;]/.test(req.query.search)) {
      return res.status(400).json({ message: "Invalid input" });
    }
    next();
};
  
  
