/**
 * @fileoverview Tests for user signout endpoint (/auth/signout)
 * @description Ensures signout functionality works correctly, including validation and security cases.
 */

import request from "supertest";
import app from "../../app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../../models/User.js"; // Import User model
import jwt from "jsonwebtoken";

// Load environment variables
dotenv.config();

// Dummy users and tokens
let validToken, expiredToken, tamperedToken, validCookieToken;

/**
 * @beforeAll Connect to the test database before running tests
 */
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Ensure database is clean before tests
  await User.deleteMany({});

  // Create test user
  const user = await User.create({
    name: "John Doe",
    email: "john@example.com",
    password: "Password@123",
  });

  // Generate valid JWT token
  validToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  // Generate expired JWT token
  expiredToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "-1h",
  });

  // Generate tampered JWT token (invalid signature)
  tamperedToken = validToken.slice(0, -1) + "X";

  // Generate valid session-based cookie
  validCookieToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
});

/**
 * @group User Signout Tests
 * @description Runs tests for /auth/signout endpoint
 */
describe("GET /auth/signout - User Signout", () => {
  /**
   * ✅ Positive Test Cases
   */
  it("✅ Should sign out successfully when authenticated with a valid token", async () => {
    const response = await request(app)
      .get("/auth/signout")
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "User signed out successfully");
  });

  /**
   * ❌ Negative Test Cases (Invalid Inputs)
   */
  it("❌ Should fail when no authorization token is provided", async () => {
    const response = await request(app).get("/auth/signout");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "No token provided");
  });

  it("❌ Should fail when using an expired token", async () => {
    const response = await request(app)
      .get("/auth/signout")
      .set("Authorization", `Bearer ${expiredToken}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid or expired token");
  });

  it("❌ Should fail when using an invalid token", async () => {
    const response = await request(app)
      .get("/auth/signout")
      .set("Authorization", "Bearer invalidtoken123");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid or expired token");
  });

  it("❌ Should fail when using a tampered token", async () => {
    const response = await request(app)
      .get("/auth/signout")
      .set("Authorization", `Bearer ${tamperedToken}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid or expired token");
  });

  it("❌ Should fail when using a malformed authorization header", async () => {
    const response = await request(app)
      .get("/auth/signout")
      .set("Authorization", validToken); // Missing "Bearer"

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "No token provided");
  });

  /**
   * 🔹 Edge Cases
   */
  it("🔹 Should fail when token contains only spaces", async () => {
    const response = await request(app)
      .get("/auth/signout")
      .set("Authorization", `Bearer "   "`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid or expired token");
  });

  it("🔹 Should allow signout when already logged out (no active session)", async () => {
    const response = await request(app)
      .get("/auth/signout")
      .set("Authorization", `Bearer ${validToken}`); // Using the same token

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "User signed out successfully");
  });

  it("🔹 Should fail when token contains unusual characters", async () => {
    const response = await request(app)
      .get("/auth/signout")
      .set("Authorization", "Bearer *@#$%");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid or expired token");
  });

  it("🔹 Should fail when using an unencoded JWT format", async () => {
    const response = await request(app)
      .get("/auth/signout")
      .set("Authorization", "Bearer header.payload.signature");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid or expired token");
  });

  /**
 * 🔺 Security Edge Cases
 */
it("🛑 Should fail when null token is provided", async () => {
    const response = await request(app)
      .get("/auth/signout")
      .set("Authorization", "Bearer null");
  
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid or expired token");
  });
  
  it("🛑 Should fail when authorization header is empty", async () => {
    const response = await request(app)
      .get("/auth/signout")
      .set("Authorization", "");
  
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "No token provided");
  });
  
  it("🛑 Should fail when token contains an SQL Injection attempt", async () => {
    const response = await request(app)
      .get("/auth/signout")
      .set("Authorization", "Bearer '; DROP TABLE users; --");
  
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid or expired token");
  });
  
  it("🛑 Should fail when token contains an XSS Injection attempt", async () => {
    const response = await request(app)
      .get("/auth/signout")
      .set("Authorization", "Bearer <script>alert('Hacked!')</script>");
  
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid or expired token");
  });
  
  it("🛑 Should fail when token contains boolean values instead of a string", async () => {
    const response = await request(app)
      .get("/auth/signout")
      .set("Authorization", "Bearer true");
  
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid or expired token");
  });
  
});

/**
 * @afterEach Clean up the test database after each test
 */
afterEach(async () => {
  await User.deleteMany({});
  const user = await User.create({
    name: "John Doe",
    email: "john@example.com",
    password: "Password@123",
  });

  validToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  validCookieToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
});

/**
 * @afterAll Close database connection
 * @description Ensures tests do not hang due to open DB connections
 */
afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});
