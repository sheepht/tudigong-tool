describe("Home Page Test", () => {
  it("Visit Home Page", () => {
    cy.visit("/");
    cy.contains("找不到頁面");
  });
});
