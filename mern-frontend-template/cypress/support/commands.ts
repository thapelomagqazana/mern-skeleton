/// <reference types="cypress" />

// Use module augmentation instead of `namespace`
export {}; // Ensure this file is treated as a module

declare module "cypress" {
  interface Chainable {
    /**
     * Custom Cypress Command for Signing Up a User
     * @param name - Full name of the user
     * @param email - Email address
     * @param password - User password
     */
    signup(name: string, email: string, password: string): Chainable<void>;
  }
}

// Define the Cypress Command
Cypress.Commands.add("signup", (name: string, email: string, password: string) => {
  cy.get("input[name=name]").type(name);
  cy.get("input[name=email]").type(email);
  cy.get("input[name=password]").type(password);
  cy.get("button[type=submit]").click();
});
