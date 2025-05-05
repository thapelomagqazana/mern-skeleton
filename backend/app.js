/**
 * @fileoverview Express App Configuration
 * @description Initializes middleware, routes, security headers, and logging.
 */

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware configuration
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

// Custom request logging
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

module.exports = app;
