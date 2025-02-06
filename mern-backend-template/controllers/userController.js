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
    // console.error("❌ Error fetching users:", error.message);
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
    // console.error("❌ Error fetching user:", error.message);
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
    const { userId } = req.params;
    const updateData = req.body;
    const requestingUser = req.user; // Extract user from auth middleware

    // Validate user ID format before querying MongoDB
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Prevent non-admin users from updating others
    if (requestingUser.role !== "admin" && requestingUser.id !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Prevent restricted fields from being updated
    if (updateData.password) {
      return res.status(400).json({ message: "Password update not allowed" });
    }

    // Prevent `_id` modification
    delete updateData._id;

    // Find and update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    // console.error("❌ Error updating user:", error.message);
    
    // Catch Mongoose validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

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
    const { userId } = req.params;
    const requesterId = req.user.id;
    const requesterRole = req.user.role;

    // Validate ObjectID format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Prevent Non-Admin from deleting other users
    if (requesterId !== userId && requesterRole !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete user
    await User.findByIdAndDelete(userId);

    // Send appropriate messages
    if (requesterId === userId) {
      return res.status(200).json({ message: "Your account has been deleted" });
    } else {
      return res.status(200).json({ message: "User deleted successfully" });
    }
  } catch (error) {
    console.error("❌ Error deleting user:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};