/**
 * @fileoverview Authentication and Authorization Middleware
 * @module middleware/authMiddleware
 * @description Protects routes by verifying JWT tokens and authorizing users.
 */

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");

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
const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token, authentication failed" });
  }
};

/**
 * @function validateQueryParams
 * @description Middleware to validate query parameters like `page` and `search`.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function.
 * @returns {void}
 */
const validateQueryParams = (req, res, next) => {
  if ((req.query.page && isNaN(req.query.page)) || Number(req.query.page) < 1) {
    return res.status(400).json({ message: "Invalid page number" });
  }

  if (req.query.search && /[<>;]/.test(req.query.search)) {
    return res.status(400).json({ message: "Invalid input" });
  }

  next();
};

// Export middleware functions
module.exports = {
  protect,
  validateQueryParams,
};
