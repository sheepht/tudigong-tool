describe("Customer Page Test", () => {
  beforeEach(() => {
    cy.loginAndSetToken();
    cy.visit("/customer");
    cy.get("main")
      .contains("h1", "客戶列表")
      .parent()
      .parent()
      .as("customerList");
  });

  it("should display customer page", () => {
    cy.url().should("include", "/customer");
  });

  it("should display create contract, create customer, create product text", () => {
    cy.checkNavigationLinks();
  });

  it("should display customer form", () => {
    cy.get("main").contains("h1", "建立客戶").should("be.visible");
    cy.get("main")
      .contains("label", "客戶姓名")
      .should("be.visible")
      .next()
      .find("input")
      .should("exist")
      .and("have.attr", "placeholder", "謝小羊");
    cy.get("main")
      .contains("label", "身份證前六碼")
      .should("be.visible")
      .next()
      .find("input")
      .should("exist")
      .and("have.attr", "placeholder", "A12345");
    cy.get("main").contains("button", "建立客戶").should("exist");
  });

  it("should display customer list", () => {
    cy.get("@customerList")
      .find("input")
      .should("exist")
      .and("have.attr", "placeholder", "搜尋");

    cy.get("@customerList")
      .find("ul")
      .should("exist")
      .within(() => {
        cy.get("li")
          .should("exist")
          .each(($li) => {
            cy.wrap($li)
              .invoke("attr", "class")
              .then((classString) => {
                expect(classString).to.include("bg-gray-100");
              });
          });
      });

    cy.get("@customerList")
      .find("ul li")
      .should("have.length.at.least", 2)
      .then(($lis) => {
        cy.wrap($lis)
          .eq(0)
          .should(($el) => {
            expect($el.css("background-color")).not.to.eq(
              $lis.eq(1).css("background-color")
            );
          });
      });

    cy.get("@customerList")
      .find("ul li")
      .each(($li) => {
        // 檢查每一列是否有文字
        cy.wrap($li)
          .invoke("text")
          .should("match", /^.+ \(.+\)$/);

        // 檢查每一列是否有超連結，並且href屬性符合預期格式
        cy.wrap($li)
          .find("a")
          .should("exist")
          .and("have.attr", "href")
          .and("match", /^\/customer\/edit\//);
      });
  });

  it("should filter customer list", () => {
    cy.get("@customerList").find("ul li").should("have.length", 6);

    cy.get("@customerList").find("input[placeholder='搜尋']").clear().type("1");
    cy.get("@customerList").find("ul li").should("have.length", 5);
    cy.get("@customerList").find("input[placeholder='搜尋']").clear().type("2");
    cy.get("@customerList").find("ul li").should("have.length", 3);
    cy.get("@customerList").find("input[placeholder='搜尋']").clear().type("3");
    cy.get("@customerList").find("ul li").should("have.length", 1);
    cy.get("@customerList").find("input[placeholder='搜尋']").clear().type("4");
    cy.get("@customerList").find("ul li").should("have.length", 1);
    cy.get("@customerList").find("input[placeholder='搜尋']").clear().type("5");
    cy.get("@customerList").find("ul li").should("have.length", 1);
  });

  // TODO: 因為會改到資料庫，所以稍後處理
  it.skip("should create customer");

  // TODO: 因為會改到資料庫，所以稍後處理
  it.skip("should modify customer");
});
