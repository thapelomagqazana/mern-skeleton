/**
 * @fileoverview Server Entry Point
 * @description Starts the Express server after connecting to MongoDB.
 */

const dotenv = require("dotenv");
const app = require("./app");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
