describe("Contract Page Test", () => {
  beforeEach(() => {
    cy.loginAndSetToken();
    cy.visit("/contract/create");
    cy.get("main")
      .contains("h1", "合約金額分配")
      .parent()
      .parent()
      .as("contractDistributionForm");
  });

  it("should display contract page", () => {
    cy.url().should("include", "/contract/create");
  });

  it("should display create contract, create customer, create product text", () => {
    cy.checkNavigationLinks();
  });

  it("should display contract form", () => {
    cy.get("main").contains("h1", "主合約內容").parent().as("contractForm");
    cy.get("@contractForm")
      .contains("label", "合約項目")
      .should("be.visible")
      .next("select#product_id")
      .should("exist")
      .and("have.value", "5")
      .within(() => {
        cy.get("option").should("have.length", 5);
        cy.get("option[value='5']").should("contain", "短期超特殊合約");
        cy.get("option[value='4']").should("contain", "特殊半年約");
        cy.get("option[value='3']").should("contain", "短期特殊合約");
        cy.get("option[value='2']").should("contain", "一般年約");
        cy.get("option[value='1']").should("contain", "一般合約");
      });
    cy.get("@contractForm")
      .contains("label", "生效日期")
      .should("be.visible")
      .next()
      .find("input[type='date']")
      .should("exist");
    cy.get("@contractForm")
      .contains("label", "客戶姓名")
      .should("be.visible")
      .next()
      .within(() => {
        cy.get("input[type='text']")
          .should("exist")
          .and("have.attr", "placeholder", "請輸入...")
          .and("have.attr", "required");
        cy.get("input#primary_customer_id")
          .should("exist")
          .and("have.attr", "type", "hidden")
          .and("have.attr", "readonly");
      });
    cy.get("@contractForm")
      .contains("label", "合約金額")
      .should("be.visible")
      .next()
      .find("input")
      .should("exist")
      .and("have.attr", "placeholder", "請輸入金額");
    cy.get("@contractForm")
      .contains("label", "合約利率")
      .should("be.visible")
      .next()
      .find("input")
      .should("exist")
      .and("have.attr", "value", "2.5")
      .and("have.attr", "type", "text")
      .and("have.attr", "required", "required")
      .and("have.attr", "disabled", "disabled");
    cy.get("@contractForm")
      .contains("label", "盈餘分配")
      .should("be.visible")
      .next()
      .find("input")
      .should("exist")
      .and("have.attr", "value", "0")
      .and("have.attr", "type", "text")
      .and("have.attr", "required", "required")
      .and("have.attr", "disabled", "disabled");
    cy.get("@contractForm")
      .contains("label", "合約周期")
      .should("be.visible")
      .next()
      .find("input")
      .should("exist")
      .and("have.attr", "value", "1")
      .and("have.attr", "type", "text")
      .and("have.attr", "required", "required")
      .and("have.attr", "disabled", "disabled");
    cy.get("@contractForm")
      .contains("label", "特殊備註")
      .should("be.visible")
      .next()
      .find("input")
      .should("exist")
      .and("have.attr", "placeholder", "bla bla bla");
    cy.get("@contractForm").contains("button", "建立合約").should("exist");
  });

  it("should display contract distribution form", () => {
    cy.get("@contractDistributionForm")
      .contains("label", "主客戶金額")
      .should("be.visible")
      .next()
      .find("input")
      .should("exist");
      // .and("have.attr", "type", "text"); 這個等前端修正

    cy.get("@contractDistributionForm")
      .contains("label", "主客戶姓名")
      .should("be.visible")
      .next()
      .find("input")
      .should("exist")
      .and("have.attr", "type", "text")
      .and("have.attr", "required", "required")
      .and("have.attr", "disabled", "disabled");

    cy.get("@contractDistributionForm")
      .contains("label", "主客戶盈餘分配")
      .should("be.visible")
      .next()
      .find("input")
      .should("exist")
      .and("have.attr", "type", "text")
      .and("have.attr", "value", "0")
      .and("have.attr", "required", "required")
      .and("have.attr", "disabled", "disabled");

    cy.get("@contractDistributionForm")
      .contains("div", "新增附掛客戶")
      .should("exist")
      .and("be.visible");
  });

  // TODO: 因為會改到資料庫，所以稍後處理
  it.skip("should create contract");

  // TODO: 因為會改到資料庫，所以稍後處理
  it.skip("should modify contract status");
});
