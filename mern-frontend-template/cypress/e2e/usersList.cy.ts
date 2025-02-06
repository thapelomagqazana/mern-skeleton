/**
 * @file usersList.cy.ts
 * @description Cypress E2E tests for UsersListPage.
 */

describe("Users List Page", () => {
    beforeEach(() => {
      cy.intercept("GET", "**/api/users", {
        statusCode: 200,
        body: {
          users: [
            { _id: "1", name: "John Doe", email: "john@example.com", role: "User" },
            { _id: "2", name: "Jane Smith", email: "jane@example.com", role: "Admin" },
          ],
        },
      }).as("fetchUsers");
  
      cy.visit("/users");
    });
  
    it("🚀 Should display the Users List page", () => {
      cy.contains("Users List").should("be.visible");
    });
  
    it("⌛ Should show a loading spinner before data loads", () => {
      cy.get("div[style*='text-align: center']").should("be.visible");
    });
  
    it("✅ Should fetch and display users correctly", () => {
      cy.wait("@fetchUsers");
      
      cy.get("table").should("be.visible");
      cy.get("tbody tr").should("have.length", 2);
      cy.contains("John Doe").should("be.visible");
      cy.contains("Jane Smith").should("be.visible");
    });
  
    // it("❌ Should show an error message when API request fails", () => {
    //   cy.intercept("GET", "**/api/users", {
    //     statusCode: 500,
    //     body: { message: "Failed to fetch users" },
    //   }).as("fetchUsersError");
  
    //   cy.visit("/users");
    //   cy.wait("@fetchUsersError");
  
    //   cy.contains("Failed to load users").should("be.visible");
    // });
});
  