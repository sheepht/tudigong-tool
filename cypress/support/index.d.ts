// ... 現有代碼 ...

declare namespace Cypress {
  interface Chainable {
    loginAndSetToken(): Chainable<void>;
    checkNavigationLinks(): Chainable<void>;
  }
}
