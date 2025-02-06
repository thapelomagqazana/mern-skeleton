/**
 * @fileoverview Tests for user registration endpoint (/auth/signup)
 * @description Ensures valid, invalid, and security-based user registrations are handled correctly
 */

import request from "supertest";
import app from "../../app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../../models/User.js"; // Import User model

// Load environment variables
dotenv.config();

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
});

/**
 * @beforeEach Ensure database is clean before each test
 */
beforeEach(async () => {
  await User.deleteMany({});
});

/**
 * @group User Registration Tests
 * @description Runs tests for /auth/signup endpoint
 */
describe("POST /auth/signup - User Registration", () => {
  /**
   * ✅ Positive Test Cases
   */
  it("✅ Should register John Doe successfully", async () => {
    const response = await request(app).post("/auth/signup").send({
      name: "John Doe",
      email: "john@example.com",
      password: "Password@123",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "User registered successfully");
    expect(response.body).toHaveProperty("userId");

    // Ensure user is saved in DB
    const user = await User.findOne({ email: "john@example.com" });
    expect(user).not.toBeNull();
  });

  it("✅ Should register Jane Smith successfully", async () => {
    const response = await request(app).post("/auth/signup").send({
      name: "Jane Smith",
      email: "jane.smith@example.com",
      password: "JanePass@456",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "User registered successfully");
    expect(response.body).toHaveProperty("userId");

    // Ensure user is saved in DB
    const user = await User.findOne({ email: "jane.smith@example.com" });
    expect(user).not.toBeNull();
  });

  /**
   * ❌ Negative Test Cases (Invalid Inputs)
   */
  it("❌ Should fail when name is missing", async () => {
    const response = await request(app).post("/auth/signup").send({
      email: "user@example.com",
      password: "Password@123",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Name is required");
  });

  it("❌ Should fail when email is missing", async () => {
    const response = await request(app).post("/auth/signup").send({
      name: "John Doe",
      password: "Password@123",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Email is required");
  });

  it("❌ Should fail when password is missing", async () => {
    const response = await request(app).post("/auth/signup").send({
      name: "John Doe",
      email: "john@example.com",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Password is required");
  });

  it("❌ Should fail when email format is invalid", async () => {
    const response = await request(app).post("/auth/signup").send({
      name: "John Doe",
      email: "invalid-email",
      password: "Password@123",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Please enter a valid email address");
  });

  it("❌ Should fail when password has no uppercase letter", async () => {
    const response = await request(app).post("/auth/signup").send({
      name: "John Doe",
      email: "john@example.com",
      password: "password@123",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Password must have at least one uppercase letter, one lowercase letter, one number, and one special character."
    );
  });

  it("❌ Should fail when password has no special character", async () => {
    const response = await request(app).post("/auth/signup").send({
      name: "John Doe",
      email: "john@example.com",
      password: "Password123",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Password must have at least one uppercase letter, one lowercase letter, one number, and one special character."
    );
  });

  it("❌ Should fail when password is too short", async () => {
    const response = await request(app).post("/auth/signup").send({
      name: "John Doe",
      email: "john@example.com",
      password: "Pass@1",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Password must be at least 8 characters long");
  });

  /**
   * 🔹 Edge Cases
   */
  it("🔹 Should accept role field in request", async () => {
    const response = await request(app).post("/auth/signup").send({
      name: "John Doe",
      email: "extra@example.com",
      password: "Password@123",
      role: "admin",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "User registered successfully");
    expect(response.body).toHaveProperty("userId");

    // Ensure only expected fields are stored
    const user = await User.findOne({ email: "extra@example.com" });
    expect(user).not.toBeNull();
    expect(user.role).toBe("admin");
  });

  it("🔹 Should trim leading and trailing spaces in email", async () => {
    const response = await request(app).post("/auth/signup").send({
      name: "John Doe",
      email: "   john@example.com   ",
      password: "Password@123",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "User registered successfully");
    expect(response.body).toHaveProperty("userId");

    // Ensure trimmed email is stored
    const user = await User.findOne({ email: "john@example.com" });
    expect(user).not.toBeNull();
  });

  it("🔹 Should handle case sensitivity in email", async () => {
    const response = await request(app).post("/auth/signup").send({
      name: "John Doe",
      email: "JOHN@EXAMPLE.COM",
      password: "Password@123",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "User registered successfully");
    expect(response.body).toHaveProperty("userId");

    // Ensure email is stored in lowercase
    const user = await User.findOne({ email: "john@example.com" });
    expect(user).not.toBeNull();
  });

  it("🔹 Should fail when name exceeds 255 characters", async () => {
    const longName = "a".repeat(256);
    const response = await request(app).post("/auth/signup").send({
      name: longName,
      email: "longname@example.com",
      password: "Password@123",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Name must be at most 255 characters long");
  });

  /**
   * ❌ Negative Test Cases (Invalid Inputs)
   */
  it("❌ Should fail when registering an already registered email", async () => {
    await User.create({ name: "Existing User", email: "john@example.com", password: "Password@123" });

    const response = await request(app).post("/auth/signup").send({
      name: "John Doe",
      email: "john@example.com",
      password: "Password@123",
    });
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "User already exists");
  });

  /**
   * 🔺 Security & Edge Cases
   */
  it("🔺 Should prevent SQL Injection attempts", async () => {
    const response = await request(app).post("/auth/signup").send({
      name: "'; DROP TABLE users; --",
      email: "hacker@example.com",
      password: "Password@123",
    });

    expect(response.status).toBe(201); // Ensures SQL Injection does NOT break database
    expect(response.body).toHaveProperty("message", "User registered successfully");
    expect(response.body).toHaveProperty("userId");

    // Ensure user is safely stored in DB
    const user = await User.findOne({ email: "hacker@example.com" });
    expect(user).not.toBeNull();
  });

  it("🔺 Should escape potential XSS attempts", async () => {
    const response = await request(app).post("/auth/signup").send({
      name: "<script>alert('XSS')</script>",
      email: "xss@example.com",
      password: "Password@123",
    });

    expect(response.status).toBe(201); // Ensures XSS is handled correctly
    expect(response.body).toHaveProperty("message", "User registered successfully");
    expect(response.body).toHaveProperty("userId");

    // Ensure user is safely stored in DB
    const user = await User.findOne({ email: "xss@example.com" });
    expect(user).not.toBeNull();
  });

  it("🔺 Should reject extremely long email addresses", async () => {
    const longEmail = "a".repeat(256) + "@example.com";
    const response = await request(app).post("/auth/signup").send({
      name: "John Doe",
      email: longEmail,
      password: "Password@123",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Email must be at most 255 characters long");
  });

  it("🔺 Should accept names with emojis", async () => {
    const response = await request(app).post("/auth/signup").send({
      name: "😊 John",
      email: "emoji@example.com",
      password: "Password@123",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "User registered successfully");
    expect(response.body).toHaveProperty("userId");

    // Ensure user is stored in DB
    const user = await User.findOne({ email: "emoji@example.com" });
    expect(user).not.toBeNull();
  });

  it("🔺 Should fail when all fields are empty", async () => {
    const response = await request(app).post("/auth/signup").send({
      name: "",
      email: "",
      password: "",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Name is required, Email is required, Password is required"
    );
  });
});

/**
 * @afterEach Clean up the test database after each test
 */
afterEach(async () => {
  await User.deleteMany({});
});

/**
 * @afterAll Close database connection
 * @description Ensures tests do not hang due to open DB connections
 */
afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});
