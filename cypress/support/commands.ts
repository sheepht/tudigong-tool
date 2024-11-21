// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("loginAndSetToken", () => {
  cy.request({
    method: "POST",
    url: "/api/auth",
    body: {
      username: "sexyoung",
      password: "test",
    },
    form: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 30000,
    retryOnStatusCodeFailure: true,
    retryOnNetworkFailure: true,
  }).then((response) => {
    expect(response.status).to.eq(200);

    expect(response.body).to.have.property("token");
    localStorage.setItem("token", response.body.token);
  });
});

Cypress.Commands.add("checkNavigationLinks", () => {
  cy.contains("建立合約").should("be.visible");
  cy.contains("建立產品").should("be.visible");
  cy.contains("建立客戶").should("be.visible");

  cy.contains("建立合約").should("have.attr", "href", "/contract/create");
  cy.contains("建立產品").should("have.attr", "href", "/product");
  cy.contains("建立客戶").should("have.attr", "href", "/customer");
});
