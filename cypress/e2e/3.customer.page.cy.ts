describe("Customer Page Test", () => {
  beforeEach(() => {
    cy.loginAndSetToken();
  });

  describe("customer list page", () => {
    beforeEach(() => {
      cy.visit("/customer");
      cy.get("main")
        .contains("h1", "客戶列表")
        .parent()
        .parent()
        .as("customerList");

      cy.get("main")
        .contains("h1", "建立客戶")
        .parent()
        .find("form")
        .as("customerForm");
      cy.get("@customerForm")
        .contains("label", "客戶姓名")
        .next()
        .find("input")
        .as("customerNameInput");
      cy.get("@customerForm")
        .contains("label", "身份證前六碼")
        .next()
        .find("input")
        .as("customerIdInput");
    });

    it("should display customer page", () => {
      cy.location("pathname").should("eq", "/customer");
    });

    it("should display create contract, create customer, create product text", () => {
      cy.checkNavigationLinks();
    });

    it("should display customer form", () => {
      cy.get("main").contains("h1", "建立客戶").should("be.visible");
      cy.get("@customerNameInput")
        .should("exist")
        .and("have.attr", "placeholder", "謝小羊");
      cy.get("@customerIdInput")
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

      cy.get("@customerList")
        .find("input[placeholder='搜尋']")
        .clear()
        .type("1");
      cy.get("@customerList").find("ul li").should("have.length", 5);
      cy.get("@customerList")
        .find("input[placeholder='搜尋']")
        .clear()
        .type("2");
      cy.get("@customerList").find("ul li").should("have.length", 3);
      cy.get("@customerList")
        .find("input[placeholder='搜尋']")
        .clear()
        .type("3");
      cy.get("@customerList").find("ul li").should("have.length", 1);
      cy.get("@customerList")
        .find("input[placeholder='搜尋']")
        .clear()
        .type("4");
      cy.get("@customerList").find("ul li").should("have.length", 1);
      cy.get("@customerList")
        .find("input[placeholder='搜尋']")
        .clear()
        .type("5");
      cy.get("@customerList").find("ul li").should("have.length", 1);
    });

    it("should validate create customer form", () => {
      cy.get("main")
        .contains("h1", "建立客戶")
        .parent()
        .find("form")
        .as("customerForm");

      // 提交表單
      cy.get("@customerForm").find("button").click();

      // 驗證客戶姓名欄位是否有 required 提示
      cy.get("@customerNameInput")
        .invoke("prop", "validationMessage")
        .should("not.be.empty");

      // 填入隨意中文名字
      cy.get("@customerNameInput").type("王大明");

      // 再次提交表單
      cy.get("@customerForm").find("button").click();

      // 驗證身份證前六碼欄位是否有 required 提示
      cy.get("@customerIdInput")
        .invoke("prop", "validationMessage")
        .should("not.be.empty");

      ["123456", "A32345", "AA2345", "AAAAAA"].forEach((customerId) => {
        // 填入錯誤的身份證前六碼
        cy.get("@customerIdInput").clear().type(customerId);

        // 再次提交表單
        cy.get("@customerForm").find("button").click();

        // 驗證身份證前六碼欄位是否有 格式錯誤 提示
        cy.get("@customerIdInput")
          .invoke("prop", "validationMessage")
          .should("not.be.empty");
      });
    });

    it("should create customer successfully", () => {
      cy.get("@customerNameInput").type("王大明");
      cy.get("@customerIdInput").type("A12345");
      cy.get("@customerForm").find("button").click();

      cy.location("pathname").should("eq", "/customer");

      cy.get("@customerList").find("ul li").should("have.length", 7);

      // 驗證第1列的客戶姓名和身份證前六碼是否正確
      cy.get("@customerList")
        .find("ul li")
        .first()
        .should("contain", "王大明 (A12345)");
    });
  });

  describe("modify customer page", () => {
    beforeEach(() => {
      cy.visit("/customer/edit/7");
      cy.get("main")
        .contains("h1", "修改客戶")
        .parent()
        .find("form")
        .as("customerForm");

      cy.get("@customerForm")
        .contains("label", "客戶姓名")
        .next()
        .find("input")
        .as("customerNameInput");
      cy.get("@customerForm")
        .contains("label", "身份證前六碼")
        .next()
        .find("input")
        .as("customerIdInput");
    });

    it("should modify customer page display correct customer information", () => {
      cy.get("@customerNameInput").should("have.value", "王大明");
      cy.get("@customerIdInput").should("have.value", "A12345");
    });

    it("should validate modify customer form", () => {
      cy.get("@customerNameInput").clear();
      cy.get("@customerIdInput").clear();
      // 提交表單
      cy.get("@customerForm").find("button").click();

      // 驗證客戶姓名欄位是否有 required 提示
      cy.get("@customerNameInput")
        .invoke("prop", "validationMessage")
        .should("not.be.empty");

      cy.get("@customerNameInput").type("王大明2");

      // 提交表單
      cy.get("@customerForm").find("button").click();

      // 驗證身份證前六碼欄位是否有 required 提示
      cy.get("@customerIdInput")
        .invoke("prop", "validationMessage")
        .should("not.be.empty");

      // 驗證身份證前六碼欄位是否有 required 提示
      cy.get("@customerIdInput")
        .invoke("prop", "validationMessage")
        .should("not.be.empty");

      // 驗證身份證前六碼格式
      ["123456", "A32345", "AA2345", "AAAAAA"].forEach((customerId) => {
        // 填入錯誤的身份證前六碼
        cy.get("@customerIdInput").clear().type(customerId);

        // 再次提交表單
        cy.get("@customerForm").find("button").click();

        // 驗證身份證前六碼欄位是否有 格式錯誤 提示
        cy.get("@customerIdInput")
          .invoke("prop", "validationMessage")
          .should("not.be.empty");
      });
    });

    it("should modify customer successfully", () => {
      cy.get("@customerNameInput").clear().type("王大明2");
      cy.get("@customerIdInput").clear().type("A23456");
      cy.get("@customerForm").find("button").click();

      // 驗證頁面是否跳轉到客戶列表頁面
      cy.location("pathname").should("eq", "/customer");

      cy.get("main")
        .contains("h1", "客戶列表")
        .parent()
        .parent()
        .as("customerList");

      cy.get("@customerList").find("ul li").should("have.length", 7);

      // 驗證第1列的客戶姓名和身份證前六碼是否正確
      cy.get("@customerList")
        .find("ul li")
        .first()
        .should("contain", "王大明2 (A23456)");
    });
  });
});
