describe("Customer Page Test", () => {
  beforeEach(() => {
    cy.loginAndSetToken();
    cy.visit("/product");
    cy.get("main")
      .contains("h1", "產品列表")
      .should("be.visible")
      .parent()
      .parent()
      .as("productList");
  });

  it("should display product page", () => {
    cy.url().should("include", "/product");
  });

  it("should display create contract, create customer, create product text", () => {
    cy.checkNavigationLinks();
  });

  it("should display product form", () => {
    cy.get("main").contains("h1", "建立產品").parent().as("productForm");
    cy.get("@productForm")
      .contains("label", "產品代號")
      .should("be.visible")
      .next()
      .find("input")
      .should("exist")
      .and("have.attr", "placeholder", "大寫英文 or 符號 or 數字 共10個字");
    cy.get("@productForm")
      .contains("label", "產品名稱")
      .should("be.visible")
      .next()
      .find("input")
      .should("exist")
      .and("have.attr", "placeholder", "限定20個字");
    cy.get("@productForm")
      .contains("label", "產品簡稱")
      .should("be.visible")
      .next()
      .find("input")
      .should("exist")
      .and("have.attr", "placeholder", "限定2個字");
    cy.get("@productForm")
      .contains("label", "合約利率(月)")
      .should("be.visible")
      .next()
      .find("input")
      .should("exist")
      .and("have.attr", "placeholder", "請輸入小於100的數字");
    cy.get("@productForm")
      .contains("label", "合約週期(月)")
      .should("be.visible")
      .next()
      .find("input")
      .should("exist")
      .and("have.attr", "placeholder", "整數");
    cy.get("@productForm")
      .contains("label", "按鈕顯示顏色")
      .should("be.visible")
      .next()
      .find("input")
      .should("exist")
      .and("have.attr", "value", "#ffffff");
    cy.get("@productForm")
      .contains("新合約預設產品")
      .should("be.visible")
      .prev()
      .find('input[type="checkbox"]')
      .should("exist")
      .and("not.be.checked");
    cy.get("@productForm").contains("button", "建立產品").should("exist");
  });

  it("should display product list", () => {
    cy.get("@productList")
      .find("input")
      .should("exist")
      .and("have.attr", "placeholder", "搜尋");

    cy.get("@productList")
      .find("table tbody tr")
      .should("have.length.at.least", 2)
      .then(($trs) => {
        cy.wrap($trs)
          .eq(0)
          .should(($el) => {
            expect($el.css("background-color")).not.to.eq(
              $trs.eq(1).css("background-color")
            );
          });
      });

    cy.get("@productList")
      .find("table thead tr")
      .should("exist")
      .within(() => {
        const expectedHeaders = [
          "代號",
          "名稱",
          "簡稱",
          "利率(月)",
          "周期",
          "顏色",
          "預設",
        ];

        cy.get("th").should("have.length", expectedHeaders.length);

        expectedHeaders.forEach((header, index) => {
          cy.get("th")
            .eq(index)
            .should("be.visible")
            .and("contain.text", header);
        });
      });

    cy.get("@productList")
      .find("table tbody tr")
      .each(($tr) => {
        cy.wrap($tr).within(() => {
          // 檢查代號
          cy.get("td")
            .eq(0)
            .invoke("text")
            .and("have.length.lte", 10)
            .should("match", /^[A-Z0-9-!@#$%^&*()_+]+$/);

          // 檢查名稱
          cy.get("td").eq(1).should("not.be.empty").and("have.length.lte", 20);

          // 檢查簡稱
          cy.get("td").eq(2).should("not.be.empty").and("have.length.lte", 2);

          // 檢查利率(月)
          cy.get("td")
            .eq(3)
            .invoke("text")
            .should("match", /^\d+(\.\d+)?%$/);

          // 檢查周期
          cy.get("td").eq(4).invoke("text").should("match", /^\d+$/);

          // 檢查顏色
          cy.get("td")
            .eq(5)
            .find("div")
            .should("have.attr", "style")
            .and("include", "background-color");

          // 檢查預設
          cy.get("td")
            .eq(6)
            .invoke("text")
            .should("match", /^(|v)$/);
        });
      });
  });

  it("should filter product list", () => {
    cy.get("@productList").find("table tbody tr").should("have.length", 5);

    cy.get("@productList")
      .find("input[placeholder='搜尋']")
      .clear()
      .type("合約");
    cy.get("@productList").find("table tbody tr").should("have.length", 3);
    cy.get("@productList")
      .find("input[placeholder='搜尋']")
      .clear()
      .type("一般");
    cy.get("@productList").find("table tbody tr").should("have.length", 2);
    cy.get("@productList")
      .find("input[placeholder='搜尋']")
      .clear()
      .type("超特");
    cy.get("@productList").find("table tbody tr").should("have.length", 1);
  });

  // TODO: 因為會改到資料庫，所以稍後處理
  it.skip("should create product");

  // TODO: 因為會改到資料庫，所以稍後處理
  it.skip("should modify product");
});
