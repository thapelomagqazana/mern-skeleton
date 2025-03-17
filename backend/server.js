/**
 * @fileoverview Server Entry Point
 * @description Starts the Express server after connecting to MongoDB.
 */

import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
