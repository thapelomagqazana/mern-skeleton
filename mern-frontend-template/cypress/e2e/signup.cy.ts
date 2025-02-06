/**
 * @file signup.cy.ts
 * @description End-to-End tests for the SignUpPage
 */
import "../support/commands"; // Ensure custom commands are loaded


describe("Sign-Up Page", () => {
    beforeEach(() => {
      cy.visit("/signup"); // Navigate to the sign-up page
    });
  
    it("🚀 Should load the sign-up page", () => {
      cy.contains("Sign Up").should("be.visible");
    });
  
    it("❌ Should show validation errors for empty fields", () => {
      cy.get("button[type=submit]").click();
      cy.contains("Name is required").should("be.visible");
      cy.contains("Email is required").should("be.visible");
      cy.contains("Password is required").should("be.visible");
    });
  
    // it("❌ Should show error for invalid email format", () => {
    //     cy.signup("John Doe", "invalid-email", "Password@123");
        
    //     // Ensure the error message appears
    //     cy.get(".MuiFormHelperText-root") // Material-UI error helper text
    //       .should("contain.text", "Invalid email");
    // });
    
  
    it("❌ Should show error for weak password", () => {
      cy.signup("John Doe", "john@example.com", "weakpas");
      cy.contains("Password must be at least 8 characters").should("be.visible");
    });
  
    it("✅ Should register user successfully and redirect to Sign-In", () => {
      cy.intercept("POST", "**/auth/signup", {
        statusCode: 201,
        body: { message: "User registered successfully" },
      }).as("signupRequest");
  
      cy.signup("John Doe", `testuser${Date.now()}@example.com`, "Password@123"); // Use unique email
      cy.wait("@signupRequest");
  
      cy.contains("User registered successfully").should("be.visible");
      cy.url().should("include", "/signin");
    });
  
    it("❌ Should display error if email is already taken", () => {
      cy.intercept("POST", "**/auth/signup", {
        statusCode: 400,
        body: { message: "User already exists" },
      }).as("signupError");
  
      cy.signup("John Doe", "john@example.com", "Password@123");
      cy.wait("@signupError");
  
      cy.contains("User already exists").should("be.visible");
    });
  });