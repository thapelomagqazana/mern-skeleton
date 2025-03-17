/**
 * @fileoverview MongoDB Database Connection
 * @module config/db
 * @description Establishes a connection with MongoDB using Mongoose.
 */

import mongoose from "mongoose";

/**
 * @function connectDB
 * @description Connects to the MongoDB database using the connection string from the environment variables.
 * @returns {Promise<void>} Resolves when the connection is successful, exits the process on failure.
 */
const connectDB = async () => {
  try {
    // Establish the database connection
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true, // Use the new URL parser for MongoDB
      useUnifiedTopology: true, // Use the new Server Discovery and Monitoring engine
    });

    // Log the successful connection
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Log the error if the connection fails
    console.error("❌ MongoDB Connection Error:", error.message);

    // Exit the process with failure code
    process.exit(1);
  }
};

// Export the function to be used in `server.js`
export default connectDB;
