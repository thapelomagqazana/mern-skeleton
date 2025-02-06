/**
 * @fileoverview Tests for retrieving a single user by ID (`/api/users/:userId`)
 * @description Ensures authorization, validation, and security measures.
 */

import request from "supertest";
import app from "../../app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../../models/User.js";
import jwt from "jsonwebtoken";

// Load environment variables
dotenv.config();

// Dummy users and tokens
let adminToken, userToken, expiredToken, invalidUserId, validUserId, nonExistentUserId;

/**
 * @beforeAll - Connect to the test database before running tests
 */
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Clear users collection
  await User.deleteMany({});

  // Create test users
  const adminUser = await User.create({
    name: "Admin User",
    email: "admin@example.com",
    password: "AdminPass@123",
    role: "admin",
  });

  const regularUser = await User.create({
    name: "Regular User",
    email: "user@example.com",
    password: "UserPass@123",
    role: "user",
  });

  // Assign valid user ID
  validUserId = regularUser._id.toString();
  nonExistentUserId = "615b9cfa5a0f1a001cbb96ab"; // Random valid ObjectID format

  // Generate JWT tokens
  adminToken = jwt.sign({ id: adminUser._id, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  userToken = jwt.sign({ id: regularUser._id, role: "user" }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  expiredToken = jwt.sign({ id: regularUser._id }, process.env.JWT_SECRET, {
    expiresIn: "-1h",
  });

  invalidUserId = "invalid1234";
});

/**
 * @group User Retrieval Tests
 */
describe("GET /api/users/:userId - Retrieve User", () => {
  /**
   * ✅ Positive Test Cases
   */
  it("✅ Should retrieve user successfully as an admin", async () => {
    const response = await request(app)
      .get(`/api/users/${validUserId}`)
      .set("Authorization", `Bearer ${adminToken}`);
      
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("user");
  });

  it("✅ Should retrieve own profile as an authenticated user", async () => {
    const response = await request(app)
      .get(`/api/users/${validUserId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("user");
  });

  /**
   * ❌ Negative Test Cases
   */
  it("❌ Should fail when no authorization token is provided", async () => {
    const response = await request(app).get(`/api/users/${validUserId}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Not authorized, no token provided");
  });

  it("❌ Should fail when using an invalid authorization token", async () => {
    const response = await request(app)
      .get(`/api/users/${validUserId}`)
      .set("Authorization", "Bearer invalidtoken123");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token, authentication failed");
  });

  it("❌ Should fail when using an expired token", async () => {
    const response = await request(app)
      .get(`/api/users/${validUserId}`)
      .set("Authorization", `Bearer ${expiredToken}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token, authentication failed");
  });

  it("❌ Should fail when a non-admin tries to access another user's profile", async () => {
    const response = await request(app)
      .get(`/api/users/${nonExistentUserId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message", "Access denied");
  });

  it("❌ Should fail when user ID is not found", async () => {
    const response = await request(app)
      .get(`/api/users/${nonExistentUserId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "User not found");
  });

  it("❌ Should fail when user ID format is invalid", async () => {
    const response = await request(app)
      .get(`/api/users/${invalidUserId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "User not found");
  });

  /**
   * 🔹 Edge Test Cases
   */
  it("🔹 Should retrieve user with extra query parameters", async () => {
    const response = await request(app)
      .get(`/api/users/${validUserId}?extra=value`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("user");
  });

  it("🔹 Should fail when retrieving a user with a long but valid user ID", async () => {
    const longValidUserId = nonExistentUserId + "123456789";
    const response = await request(app)
      .get(`/api/users/${longValidUserId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "User not found");
  });

  it("🔹 Should reject SQL injection attempts in user ID", async () => {
    const response = await request(app)
      .get(`/api/users/'; DROP TABLE users; --`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "User not found");
  });

  it("🔹 Should reject XSS attempts in user ID", async () => {
    const response = await request(app)
      .get(`/api/users/<script>alert('XSS')</script>`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
  });

  /**
   * 🛑 Corner Test Cases
   */

  it("🛑 Should fail when user ID contains special characters", async () => {
    const response = await request(app)
      .get(`/api/users/!@#$%^&*()`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "User not found");
  });

  it("🛑 Should fail when user ID is a boolean value", async () => {
    const response = await request(app)
      .get(`/api/users/true`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "User not found");
  });

  it("🛑 Should fail when user ID is a numeric value", async () => {
    const response = await request(app)
      .get(`/api/users/123456789`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "User not found");
  });
});

/**
 * @afterAll - Close database connection after tests
 */
afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});
