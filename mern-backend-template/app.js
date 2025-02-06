/**
 * @fileoverview Express App Configuration
 * @description Initializes middleware, routes, security headers, and logging.
 */

import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan"; // HTTP request logger middleware
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware configuration
app.use(morgan("dev")); // Log HTTP requests and responses in the terminal
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(cookieParser()); // Parse and handle cookies
app.use(compression()); // Compress response bodies
app.use(helmet()); // Secure app with HTTP headers
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true })); // Allow frontend requests
app.use((req, res, next) => {
    console.log("👉 Incoming Request:", req.method, req.url);
    console.log("📥 Request Body:", req.body);
    console.log("📥 Request Headers:", req.headers);
  
    const oldSend = res.send;
    res.send = function (data) {
      console.log("📤 Response Status:", res.statusCode);
      console.log("📤 Response Body:", data);
      oldSend.apply(res, arguments);
    };
  
    next();
});
  

// Routes
app.use("/api/users", userRoutes);
app.use("/auth", authRoutes);

// Default route
app.get("/", (req, res) => res.send("MERN Skeleton API Running"));

export default app;
