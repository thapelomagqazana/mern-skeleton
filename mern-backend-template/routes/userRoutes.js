/**
 * @fileoverview User Routes
 * @module routes/userRoutes
 * @description Defines API endpoints for user CRUD operations.
 */

import express from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route GET /api/users
 * @description Retrieves all users (public access, no authentication required).
 * @access Public
 */
router.get("/", getUsers);

/**
 * @route GET /api/users/:userId
 * @description Retrieves a single user by ID.
 * @access Protected (Requires authentication)
 */
router.get("/:userId", protect, getUserById);

/**
 * @route PUT /api/users/:userId
 * @description Updates user details (name, password).
 * @access Protected (Requires authentication)
 */
router.put("/:userId", protect, updateUser);

/**
 * @route DELETE /api/users/:userId
 * @description Deletes a user account.
 * @access Protected (Requires authentication)
 */
router.delete("/:userId", protect, deleteUser);

export default router;
