// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />

context("Example Cypress TodoMVC test", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("should have a header", () => {
    cy.get("form").should("have.class", "search-form");
  });
});
