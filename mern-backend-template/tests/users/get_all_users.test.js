/**
 * @fileoverview Tests for user listing endpoint (/api/users)
 * @description Ensures retrieval of user data works correctly, including authentication, pagination, and security cases.
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
let adminToken, userToken, expiredToken, invalidToken = "invalidtoken123";

/**
 * @beforeAll Connect to the test database before running tests
 */
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Clean database
  await User.deleteMany({});

  // Create admin user
  const adminUser = await User.create({
    name: "Admin User",
    email: "admin@example.com",
    password: "Admin@123",
    role: "admin",
  });

  // Create regular user
  const regularUser = await User.create({
    name: "Regular User",
    email: "user@example.com",
    password: "User@123",
    role: "user",
  });

  // Generate JWT tokens
  adminToken = jwt.sign({ id: adminUser._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });
  userToken = jwt.sign({ id: regularUser._id, role: "user" }, process.env.JWT_SECRET, { expiresIn: "1h" });
  expiredToken = jwt.sign({ id: adminUser._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "-1h" });
});

/**
 * @group User Listing Tests
 * @description Runs tests for GET /api/users endpoint
 */
describe("GET /api/users - Retrieve Users", () => {
  /**
   * ✅ Positive Test Cases
   */
  it("✅ Should retrieve users successfully as an admin", async () => {
    const response = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("users");
    expect(Array.isArray(response.body.users)).toBeTruthy();
  });

  it("✅ Should retrieve users successfully as an authenticated non-admin (if allowed)", async () => {
    const response = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("users");
    expect(Array.isArray(response.body.users)).toBeTruthy();
  });

  it("✅ Should support pagination - Page 1", async () => {
    const response = await request(app)
      .get("/api/users?page=1")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("users");
  });

  it("✅ Should support pagination - Page 2", async () => {
    const response = await request(app)
      .get("/api/users?page=2")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("users");
  });

  it("✅ Should filter users by role", async () => {
    const response = await request(app)
      .get("/api/users?role=admin")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.users.every(user => user.role === "admin")).toBeTruthy();
  });

  it("✅ Should sort users alphabetically by name", async () => {
    const response = await request(app)
      .get("/api/users?sort=name")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("users");
  });

  it("✅ Should allow searching users by name", async () => {
    const response = await request(app)
      .get("/api/users?search=Admin")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("users");
  });

  /**
   * ❌ Negative Test Cases
   */
  it("❌ Should fail when no authorization token is provided", async () => {
    const response = await request(app).get("/api/users");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Not authorized, no token provided");
  });

  it("❌ Should fail when using an invalid authorization token", async () => {
    const response = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${invalidToken}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token, authentication failed");
  });

  it("❌ Should fail when using an expired token", async () => {
    const response = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${expiredToken}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token, authentication failed");
  });

//   it("❌ Should fail when a non-admin tries to access (if restricted)", async () => {
//     const response = await request(app)
//       .get("/api/users")
//       .set("Authorization", `Bearer ${userToken}`);

//     expect(response.status).toBe(403);
//     expect(response.body).toHaveProperty("message", "Access denied");
//   });

  it("❌ Should fail when using an invalid page parameter", async () => {
    const response = await request(app)
      .get("/api/users?page=-1")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Invalid page number");
  });

  it("❌ Should fail when using a non-numeric page parameter", async () => {
    const response = await request(app)
      .get("/api/users?page=abc")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Invalid page number");
  });

  it("❌ Should reject SQL injection attempts in search", async () => {
    const response = await request(app)
      .get("/api/users?search='; DROP TABLE users; --")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Invalid input");
  });

  it("❌ Should reject cross-site scripting (XSS) attempts in search", async () => {
    const response = await request(app)
      .get("/api/users?search=<script>alert('Hacked!')</script>")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Invalid input");
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
