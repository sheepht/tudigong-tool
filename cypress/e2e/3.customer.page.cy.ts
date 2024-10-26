describe("Customer Page Test", () => {
  beforeEach(() => {
    cy.loginAndSetToken();
    cy.visit("/customer");
  });

  it("should display customer page", () => {
    cy.url().should("include", "/customer");
  });
});
