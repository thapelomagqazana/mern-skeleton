/**
 * @fileoverview Tests for user authentication endpoint (/auth/signin)
 * @description Ensures login functionality works correctly, including validation and security cases.
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

  // Seed database with valid users
  await User.create([
    { name: "John Doe", email: "john@example.com", password: "Password@123" },
    { name: "Jane Smith", email: "jane.smith@example.com", password: "JanePass@456" },
  ]);
});

/**
 * @group User Login Tests
 * @description Runs tests for /auth/signin endpoint
 */
describe("POST /auth/signin - User Login", () => {
  /**
   * ✅ Positive Test Cases
   */
  it("✅ Should log in John Doe successfully", async () => {
    const response = await request(app).post("/auth/signin").send({
      email: "john@example.com",
      password: "Password@123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("✅ Should log in Jane Smith successfully", async () => {
    const response = await request(app).post("/auth/signin").send({
      email: "jane.smith@example.com",
      password: "JanePass@456",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("✅ Should allow email case insensitivity", async () => {
    const response = await request(app).post("/auth/signin").send({
      email: "JOHN@EXAMPLE.COM",
      password: "Password@123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("✅ Should trim spaces from email before authenticating", async () => {
    const response = await request(app).post("/auth/signin").send({
      email: "  john@example.com   ",
      password: "Password@123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  /**
   * ❌ Negative Test Cases (Invalid Inputs)
   */
  it("❌ Should fail when email is not registered", async () => {
    const response = await request(app).post("/auth/signin").send({
      email: "notfound@example.com",
      password: "Password@123",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid credentials");
  });

  it("❌ Should fail when password is incorrect", async () => {
    const response = await request(app).post("/auth/signin").send({
      email: "john@example.com",
      password: "WrongPass@123",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid credentials");
  });

  it("❌ Should fail when email is empty", async () => {
    const response = await request(app).post("/auth/signin").send({
      email: "",
      password: "Password@123",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Email is required");
  });

  it("❌ Should fail when password is empty", async () => {
    const response = await request(app).post("/auth/signin").send({
      email: "john@example.com",
      password: "",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Password is required");
  });

  it("❌ Should fail when both email and password are empty", async () => {
    const response = await request(app).post("/auth/signin").send({
      email: "",
      password: "",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Email is required, Password is required");
  });

  it("❌ Should fail when email format is invalid", async () => {
    const response = await request(app).post("/auth/signin").send({
      email: "invalid-email",
      password: "Password@123",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Please enter a valid email address");
  });

  /**
   * 🔺 Security Tests
   */
  it("🔺 Should reject SQL injection attempts", async () => {
    const response = await request(app).post("/auth/signin").send({
      email: "'; DROP TABLE users; --",
      password: "Password@123",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Please enter a valid email address");
  });

  it("🔺 Should reject cross-site scripting (XSS) attempts", async () => {
    const response = await request(app).post("/auth/signin").send({
      email: "<script>alert('XSS')</script>",
      password: "Password@123",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Please enter a valid email address");
  });

    /**
   * 🔹 Edge Cases
   */
    it("🔹 Should reject extremely long email addresses", async () => {
        const response = await request(app).post("/auth/signin").send({
          email: "a".repeat(256) + "@example.com",
          password: "Password@123",
        });
    
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Email must be at most 255 characters long");
    });

    it("🔹 Should reject email containing emojis", async () => {
    const response = await request(app).post("/auth/signin").send({
        email: "😀@example.com",
        password: "Password@123",
    });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Please enter a valid email address");
    });

    // it("🔹 Should allow emoji in password", async () => {
    // const response = await request(app).post("/auth/signin").send({
    //     email: "john@example.com",
    //     password: "😀😃😄😁@123",
    // });

    //     expect(response.status).toBe(200);
    //     expect(response.body).toHaveProperty("token");
    // });

    it("🔹 Should reject email with multiple consecutive dots", async () => {
    const response = await request(app).post("/auth/signin").send({
        email: "john..doe@example.com",
        password: "Password@123",
    });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Please enter a valid email address");
    });

    // it("🔹 Should allow email with Unicode characters", async () => {
    // const response = await request(app).post("/auth/signin").send({
    //     email: "jöhn@example.com",
    //     password: "Password@123",
    // });

    //     expect(response.status).toBe(200);
    //     expect(response.body).toHaveProperty("token");
    // });
});

/**
 * @afterEach Clean up the test database after each test
 */
afterEach(async () => {
  await User.deleteMany({});
  await User.create([
    { name: "John Doe", email: "john@example.com", password: "Password@123" },
    { name: "Jane Smith", email: "jane.smith@example.com", password: "JanePass@456" },
  ]);
});

/**
 * @afterAll Close database connection
 * @description Ensures tests do not hang due to open DB connections
 */
afterAll(async () => {
  await mongoose.connection.close();
});
