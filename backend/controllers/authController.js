/**
 * @fileoverview Authentication Controller
 * @module controllers/authController
 * @description Handles user authentication, including sign-in, sign-up, and sign-out.
 */

const User = require("../models/User");
const jwt = require("jsonwebtoken");

/**
 * @function registerUser
 * @description Registers a new user in the database.
 * @param {Object} req - Express request object containing user details (name, email, password).
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response containing success message and user ID.
 */
const registerUser = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    let errors = [];

    if (!name) errors.push("Name is required");
    if (!email) errors.push("Email is required");
    if (!password) errors.push("Password is required");

    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join(", ") });
    }

    role = role ?? "user";

    const validRoles = ["user", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: Object.values(error.errors).map((err) => err.message).join(", "),
      });
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
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let errors = [];
    if (!email) errors.push("Email is required");
    if (!password) errors.push("Password is required");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email.trim())) {
      errors.push("Please enter a valid email address");
    }

    if (email && email.trim().length > 255) {
      errors.push("Email must be at most 255 characters long");
    }

    if (email && /[\u{1F600}-\u{1F64F}]/u.test(email)) {
      errors.push("Please enter a valid email address");
    }

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

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @function logoutUser
 * @description Logs out a user by clearing JWT and validating the request token.
 * @route GET /auth/signout
 * @access Protected
 */
const logoutUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    res.clearCookie("jwt");

    return res.status(200).json({ message: "User signed out successfully" });
  } catch (error) {
    console.error("Signout Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Exporting all controller functions
module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
