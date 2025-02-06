/**
 * @fileoverview User Controller
 * @module controllers/userController
 * @description Implements logic for user CRUD operations.
 */

import User from "../models/User.js";
import mongoose from "mongoose";

/**
 * @function getUsers
 * @description Retrieves all users from the database.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response containing a list of users (excluding passwords).
 */
export const getUsers = async (req, res) => {
  try {
    let query = {};
    if (req.query.role) {
      query.role = req.query.role; // Apply role filter
    }
    // Fetch all users, excluding passwords for security
    const users = await User.find(query).select("-password");
    res.json({users: users});
  } catch (error) {
    console.error("❌ Error fetching users:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @function getUserById
 * @description Retrieves a user by ID.
 * @param {Object} req - Express request object containing `userId` as a URL parameter.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response containing the user data (excluding password).
 */
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const requesterId = req.user.id;
    const isAdmin = req.user.role === "admin";

    // Ensure user can only fetch their profile or admin can fetch any user
    if (!isAdmin && userId !== requesterId) {
      return res.status(403).json({ message: "Access denied" });
    }

    // XSS Attack Prevention
    const xssRegex = /<script>|<\/script>/i;
    if (xssRegex.test(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Validate ObjectID format
    if (!mongoose.Types.ObjectId.isValid(userId) || !isNaN(userId) || userId.length > 24) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("❌ Error fetching user:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @function updateUser
 * @description Updates user details (name, password).
 * @param {Object} req - Express request object containing `userId` and updated data.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response with the updated user details.
 */
export const updateUser = async (req, res) => {
  try {
    // Find user by ID
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update name if provided
    user.name = req.body.name || user.name;

    // Update password if provided
    if (req.body.password) {
      user.password = req.body.password;
    }

    // Save updated user details
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    console.error("❌ Error updating user:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @function deleteUser
 * @description Deletes a user from the database.
 * @param {Object} req - Express request object containing `userId` as a URL parameter.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response confirming user deletion.
 */
export const deleteUser = async (req, res) => {
  try {
    // Find and delete user by ID
    const user = await User.findByIdAndDelete(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting user:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
