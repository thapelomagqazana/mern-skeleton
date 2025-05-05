/**
 * @fileoverview User Controller
 * @module controllers/userController
 * @description Implements logic for user CRUD operations.
 */

const User = require("../models/User");
const mongoose = require("mongoose");

/**
 * @function getUsers
 * @description Retrieves all users from the database.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response containing a list of users (excluding passwords).
 */
const getUsers = async (req, res) => {
  try {
    let query = {};
    if (req.query.role) {
      query.role = req.query.role;
    }
    const users = await User.find(query).select("-password");
    res.json({ users: users });
  } catch (error) {
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
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const requesterId = req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isAdmin && userId !== requesterId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const xssRegex = /<script>|<\/script>/i;
    if (xssRegex.test(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId) || !isNaN(userId) || userId.length > 24) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
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
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;
    const requestingUser = req.user;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (requestingUser.role !== "admin" && requestingUser.id !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (updateData.password) {
      return res.status(400).json({ message: "Password update not allowed" });
    }

    delete updateData._id;

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
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const requesterId = req.user.id;
    const requesterRole = req.user.role;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (requesterId !== userId && requesterRole !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(userId);

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

// Exporting all controller functions
module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
