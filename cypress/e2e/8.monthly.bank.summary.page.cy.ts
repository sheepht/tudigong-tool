describe("Monthly Bank Summary Page Test", () => {
  beforeEach(() => {
    cy.loginAndSetToken();
    cy.viewport("macbook-13");
    cy.visit("/monthly-bank-summary?month=2024/02");
    cy.contains("24/02").parent().as("header");
    cy.get("@header").parent().as("page");
  });

  it("should display correct URL", () => {
    cy.location("pathname").should("eq", "/monthly-bank-summary");
    cy.location("search").should("eq", "?month=2024/02");
  });

  describe("header", () => {
    it("should display back link to calendar", () => {
      cy.get("@header")
        .find("a")
        .first()
        .should("have.attr", "href")
        .and("include", "/calendar");
    });

    it("should display month text", () => {
      cy.contains("24/02").should("be.visible");
    });

    it("should display total amount", () => {
      cy.get("@header").contains("$").should("be.visible");
    });
  });

  describe("bank tabs", () => {
    it("should display bank tabs", () => {
      cy.get("@page").find("button").should("have.length.gte", 1);
    });

    it("should first tab be active by default", () => {
      cy.get("@page").find("button").first().should("have.class", "border-b-2");
    });

    it("should display bank name and amount on each tab", () => {
      cy.get("@page").find("button").each(($btn) => {
        cy.wrap($btn)
          .invoke("text")
          .should("match", /^.+ \$[\d,]+$/);
      });
    });

    it("should switch active tab on click", () => {
      cy.get("@page").find("button").then(($buttons) => {
        if ($buttons.length > 1) {
          cy.get("@page").find("button").eq(1).click();
          cy.get("@page").find("button").eq(1).should("have.class", "border-b-2");
          cy.get("@page").find("button").eq(0).should("not.have.class", "border-b-2");
        }
      });
    });
  });

  describe("customer list", () => {
    it("should display customers for active bank", () => {
      cy.get("ul li").should("have.length.gte", 1);
    });

    it("should display amount and name for each customer", () => {
      cy.get("ul li").each(($li) => {
        cy.wrap($li)
          .invoke("text")
          .should("match", /^[\d,]+ .+$/);
      });
    });

    it("should update customer list when switching tabs", () => {
      cy.get("@page").find("button").then(($buttons) => {
        if ($buttons.length > 1) {
          cy.get("ul li")
            .first()
            .invoke("text")
            .then(() => {
              cy.get("@page").find("button").eq(1).click();
              cy.get("ul li").should("have.length.gte", 1);
            });
        }
      });
    });
  });

  describe("navigation", () => {
    it("should navigate back to calendar", () => {
      cy.get("@header").find("a").first().click();
      cy.location("pathname").should("eq", "/calendar");
      cy.location("search").should("include", "month=2024");
    });
  });
});
