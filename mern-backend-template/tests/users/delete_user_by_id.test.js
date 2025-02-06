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

beforeEach(async () => {
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
  adminToken = jwt.sign({ id: adminUser._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });
  userToken = jwt.sign({ id: regularUser._id, role: "user" }, process.env.JWT_SECRET, { expiresIn: "1h" });
  expiredToken = jwt.sign({ id: regularUser._id }, process.env.JWT_SECRET, { expiresIn: "-1h" });

  invalidUserId = "invalid1234";
});

afterEach(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

// ✅ Positive Test Cases
describe("DELETE /api/users/:userId - Delete User", () => {
  it("✅ Admin Deletes a User Successfully", async () => {
    const response = await request(app)
      .delete(`/api/users/${validUserId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "User deleted successfully");
  });

  it("✅ User Deletes Own Account Successfully", async () => {
    const response = await request(app)
      .delete(`/api/users/${validUserId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Your account has been deleted");
  });

  // ❌ Negative Test Cases
  it("❌ Unauthenticated Request", async () => {
    const response = await request(app).delete(`/api/users/${validUserId}`);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Not authorized, no token provided");
  });

  it("❌ Invalid Authorization Token", async () => {
    const response = await request(app)
      .delete(`/api/users/${validUserId}`)
      .set("Authorization", "Bearer invalidtoken123");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token, authentication failed");
  });

  it("❌ Expired Token", async () => {
    const response = await request(app)
      .delete(`/api/users/${validUserId}`)
      .set("Authorization", `Bearer ${expiredToken}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token, authentication failed");
  });

//   it("❌ Non-Admin Trying to Delete Another User", async () => {
//     const response = await request(app)
//       .delete(`/api/users/${validUserId}`)
//       .set("Authorization", `Bearer ${userToken}`);

//     expect(response.status).toBe(403);
//     expect(response.body).toHaveProperty("message", "Access denied");
//   });

  it("❌ User ID Not Found", async () => {
    const response = await request(app)
      .delete(`/api/users/${nonExistentUserId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "User not found");
  });

  it("❌ Invalid User ID Format", async () => {
    const response = await request(app)
      .delete(`/api/users/${invalidUserId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Invalid user ID");
  });

  // 🔹 Edge Test Cases
  it("🔹 Delete User with Extra Query Parameters", async () => {
    const response = await request(app)
      .delete(`/api/users/${validUserId}?extra=value`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "User deleted successfully");
  });

  it("🔹 Delete User with a Long but Valid User ID", async () => {
    const longValidUserId = "615b9cfa5a0f1a001cbb96ab123456789";
    const response = await request(app)
      .delete(`/api/users/${longValidUserId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Invalid user ID");
  });

  it("🔹 SQL Injection Attempt in User ID", async () => {
    const response = await request(app)
      .delete(`/api/users/'; DROP TABLE users; --`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Invalid user ID");
  });

  it("🔹 Cross-Site Scripting (XSS) Attempt in User ID", async () => {
    const response = await request(app)
      .delete(`/api/users/<script>alert('XSS')</script>`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
  });

  // 🛑 Corner Test Cases
  it("🛑 Empty User ID in Request", async () => {
    const response = await request(app)
      .delete(`/api/users/`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
  });

  it("🛑 User ID with Special Characters", async () => {
    const response = await request(app)
      .delete(`/api/users/!@#$%^&*()`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Invalid user ID");
  });

  it("🛑 Boolean User ID", async () => {
    const response = await request(app)
      .delete(`/api/users/true`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Invalid user ID");
  });

  it("🛑 Numeric User ID", async () => {
    const response = await request(app)
      .delete(`/api/users/123456789`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Invalid user ID");
  });
});
