/**
 * @fileoverview User Routes
 * @module routes/userRoutes
 * @description Defines API endpoints for user CRUD operations.
 */

const express = require("express");
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const {
  protect,
  validateQueryParams,
} = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @route GET /api/users
 * @description Retrieves all users.
 * @access Protected (Requires authentication)
 */
router.get("/", protect, validateQueryParams, getUsers);

/**
 * @route GET /api/users/:userId
 * @description Retrieves a single user by ID.
 * @access Protected (Requires authentication)
 */
router.get("/:userId", protect, getUserById);

/**
 * @route PUT /api/users/:userId
 * @description Updates user details (only the signed-in user can update their own info).
 * @access Protected (Requires authentication & authorization)
 */
router.put("/:userId", protect, updateUser);

/**
 * @route DELETE /api/users/:userId
 * @description Deletes a user account (only the signed-in user can delete their own account).
 * @access Protected (Requires authentication & authorization)
 */
router.delete("/:userId", protect, deleteUser);

module.exports = router;
