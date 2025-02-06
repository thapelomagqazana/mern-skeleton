/// <reference types="cypress" />

describe("Sign-In Page E2E Tests", () => {
    beforeEach(() => {
      cy.visit("/signin"); // Navigate to Sign-In page before each test
    });
  
    it("🚀 Should load the sign-in page", () => {
      cy.contains("Sign In").should("be.visible");
    });
  
    it("❌ Should show validation errors for empty fields", () => {
      cy.get("button[type=submit]").click();
      cy.contains("Email is required").should("be.visible");
      cy.contains("Password is required").should("be.visible");
    });
  
    it("❌ Should show an error for an invalid email format", () => {
      cy.get("input[name=email]").type("invalid-email");
      cy.get("input[name=password]").type("Password@123");
      cy.get("button[type=submit]").click();
      cy.contains("Invalid email").should("be.visible");
    });
  
    it("❌ Should show an error for incorrect credentials", () => {
      cy.intercept("POST", "**/auth/signin", {
        statusCode: 401,
        body: { message: "Invalid email or password" },
      }).as("loginRequest");
  
      cy.login("wrong@example.com", "WrongPassword123!");
      cy.wait("@loginRequest");
      
      cy.contains("Invalid email or password").should("be.visible");
    });
  
    it("✅ Should successfully log in and redirect to the dashboard", () => {
      cy.intercept("POST", "**/auth/signin", {
        statusCode: 200,
        body: {
          message: "Login successful",
          token: "valid_jwt_token",
          user: { id: "12345", email: "user@example.com", name: "John Doe" },
        },
      }).as("loginRequest");
  
      cy.login("user@example.com", "ValidPassword@123");
      cy.wait("@loginRequest");
  
      cy.contains("Login successful").should("be.visible");
  
      // Ensure redirection to the dashboard
      cy.url().should("include", "/dashboard");
    });
  
    it("❌ Should display error if server is down", () => {
      cy.intercept("POST", "**/auth/signin", {
        statusCode: 500,
        body: { message: "Server error. Please try again later." },
      }).as("serverError");
  
      cy.login("user@example.com", "ValidPassword@123");
      cy.wait("@serverError");
  
      cy.contains("Server error. Please try again later.").should("be.visible");
    });
  });
  