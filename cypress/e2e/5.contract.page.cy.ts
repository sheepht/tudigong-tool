describe("Contract Page Test", () => {
  beforeEach(() => {
    cy.loginAndSetToken();
    cy.visit("/contract/create");
    cy.get("main")
      .contains("h1", "合約金額分配")
      .parent()
      .parent()
      .as("contractDistributionForm");
    cy.get("@contractDistributionForm")
      .contains("新增附掛客戶")
      .as("addPartContractBtn");
    cy.get("@contractDistributionForm").children().eq(1).as("partList");
    cy.get("main").contains("h1", "主合約內容").parent().as("contractForm");
  });

  it("should display contract page", () => {
    cy.location("pathname").should("eq", "/contract/create");
  });

  it("should display create contract, create customer, create product text", () => {
    cy.checkNavigationLinks();
  });

  it("should display contract form", () => {
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

  it("should create/delete part contract, and up to 5", () => {
    cy.get("@contractDistributionForm").should("be.visible");
    cy.get("@partList")
      .children()
      .eq(0)
      .within(() => {
        cy.contains("主客戶金額").should("be.visible");
        cy.contains("主客戶姓名").should("be.visible");
        cy.contains("主客戶盈餘分配").should("be.visible");
      });

    for (let i = 2; i <= 5; i++) {
      cy.get("@addPartContractBtn").should("be.visible");
      cy.get("@partList").children().should("have.length", i);
      cy.get("@addPartContractBtn").click();
      cy.get("@partList")
        .children()
        .eq(i - 1)
        .within(() => {
          cy.contains(`附掛金額 - ${i}`).should("be.visible");
          cy.contains(`附掛客戶姓名 - ${i}`).should("be.visible");
          cy.contains(`附掛盈餘分配 - ${i}`).should("be.visible");
        });
    }
    cy.get("@partList").children().should("have.length", 5);
    cy.get("@addPartContractBtn").should("not.exist");

    for (let i = 5; i >= 2; i--) {
      cy.get("@partList")
        .children()
        .eq(i - 1)
        .within(() => {
          cy.contains("刪除").click();
          cy.get("@addPartContractBtn").should("be.visible");
          cy.get("@partList").children().should("have.length", i);
        });
    }
  });

  it.only("should create contract", () => {
    // 輸入主合約的內容
    cy.get("@contractForm").find("#product_id").select("1");
    cy.get("@contractForm").find("#start_date").type("2024-01-01");
    cy.get("@contractForm")
      .contains("label", "客戶姓名")
      .next()
      .children()
      .eq(0)
      .children()
      .eq(0)
      .as("primaryCustomerName");
    cy.get("@primaryCustomerName").click();
    cy.get("@primaryCustomerName").next().as("primaryCustomerSelect");
    cy.get("@primaryCustomerSelect").children().eq(0).click();
    cy.get("@contractForm").find("#total_amount").type("100000");
    cy.get("@contractForm")
      .contains("label", "合約利率")
      .next()
      .find("input")
      .should("have.value", "1.2")
      .and("be.disabled");
    cy.get("@contractForm")
      .contains("label", "盈餘分配")
      .next()
      .find("input")
      .should("have.value", "1200")
      .and("be.disabled");
    cy.get("@contractForm")
      .contains("label", "合約周期")
      .next()
      .find("input")
      .should("have.value", "6")
      .and("be.disabled");
    cy.get("@contractForm")
      .contains("label", "特殊備註")
      .next()
      .find("input")
      .type("bla bla bla");

    // 輸入附掛客戶的內容
    cy.get("@contractDistributionForm").find("#part1_amount").type("40000");
    cy.get("@contractDistributionForm")
      .contains("label", "主客戶姓名")
      .next()
      .find("input")
      .should("have.value", "東南西北")
      .and("be.disabled");
    cy.get("@contractDistributionForm")
      .contains("label", "主客戶盈餘分配")
      .next()
      .find("input")
      .should("have.value", "480")
      .and("be.disabled");

    for (let i = 2; i <= 4; i++) {
      cy.get("@contractForm")
        .contains("合約金額與附掛金額總和不符")
        .should("be.visible");
      cy.get("@contractForm")
        .contains("button", "建立合約")
        .should("be.disabled");
      cy.get("@addPartContractBtn").click();
      cy.get("@partList")
        .children()
        .eq(i - 1)
        .within(() => {
          const amount = 50000 - i * 10000;
          cy.contains(`附掛金額 - ${i}`)
            .next()
            .find("input")
            .type(amount.toString());
          cy.contains(`附掛客戶姓名 - ${i}`)
            .next()
            .children()
            .eq(0)
            .children()
            .eq(0)
            .click();
          cy.contains(`附掛客戶姓名 - ${i}`)
            .next()
            .children()
            .eq(0)
            .find("ul")
            .children()
            .eq(i - 1)
            .click();
          cy.contains(`附掛盈餘分配 - ${i}`)
            .next()
            .find("input")
            .should("have.value", amount * 0.012);
        });
    }
    cy.get("@contractForm")
      .contains("合約金額與附掛金額總和不符")
      .should("not.exist");
    cy.get("@contractForm")
      .contains("button", "建立合約")
      .should("not.be.disabled");
  });

  // TODO: 因為會改到資料庫，所以稍後處理
  it("should modify contract status");
});
