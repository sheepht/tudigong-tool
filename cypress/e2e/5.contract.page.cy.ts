type ValidateFieldParams = {
  dom: string;
  label: string;
  value: string;
  disabled?: boolean;
};

function validateField({ dom, label, value, disabled }: ValidateFieldParams) {
  cy.get(dom)
    .contains("label", label)
    .next()
    .find("input")
    .then(($input) => {
      if (!disabled) {
        cy.wrap($input).clear().type(value);
      }
      cy.wrap($input).should("have.value", value);
    });
  if (disabled) {
    cy.get(dom).find("input").should("be.disabled");
  }
}

describe("Contract Page Test", () => {
  beforeEach(() => {
    cy.loginAndSetToken();
  });

  describe("Create contract", () => {
    beforeEach(() => {
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
        .and("have.value", "8")
        .within(() => {
          cy.get("option").should("have.length", 8);
          cy.get("option[value='8']").should("contain", "測試合約");
          cy.get("option[value='7']").should("contain", "新年約");
          cy.get("option[value='6']").should("contain", "新半年約");
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
        .and("have.attr", "value", "15")
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
        .and("have.attr", "value", "6")
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

    it("should create contract", () => {
      // 輸入主合約的內容
      cy.get("@contractForm").find("#product_id").select("1");
      cy.get("@contractForm").find("#start_date").type("2024-01-07");
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

      validateField({
        dom: "@contractForm",
        label: "合約利率",
        value: "1.2",
        disabled: true,
      });

      validateField({
        dom: "@contractForm",
        label: "盈餘分配",
        value: "1200",
        disabled: true,
      });

      validateField({
        dom: "@contractForm",
        label: "合約周期",
        value: "6",
        disabled: true,
      });

      validateField({
        dom: "@contractForm",
        label: "特殊備註",
        value: "bla bla bla",
      });

      // 輸入附掛客戶的內容
      cy.get("@contractDistributionForm").find("#part1_amount").type("40000");
      validateField({
        dom: "@contractDistributionForm",
        label: "主客戶姓名",
        value: "王大明2",
        disabled: true,
      });
      validateField({
        dom: "@contractDistributionForm",
        label: "主客戶盈餘分配",
        value: "480",
        disabled: true,
      });

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
        .should("not.be.disabled")
        .click();

      cy.contains("合約建立成功").should("be.visible");
    });

    it("should validate created contract", () => {
      const firstColor = "rgb(37, 99, 235)";
      const otherColor = "rgb(107, 114, 128)";

      for (let i = 1; i <= 7; i++) {
        const typeText = i === 1 ? "新合約" : "走期約";
        cy.visit(`/calendar-detail?date=2024/0${i}/07`);
        cy.contains(`${i}月7號`).should("be.visible");
        cy.contains(typeText).should("be.visible");
        cy.contains(typeText)
          .next()
          .children()
          .eq(0)
          .each(($el) => {
            cy.wrap($el).children().eq(0).should("have.text", "10");
            cy.wrap($el)
              .children()
              .eq(1)
              .should("have.text", `一般${i - 1}`);
            cy.wrap($el)
              .children()
              .eq(2)
              .should("have.text", "修")
              .should("have.attr", "href")
              .and("match", /^\/contract\/edit\/\d+\/\d+$/);
            cy.wrap($el)
              .children()
              .eq(3)
              .should("have.text", "續")
              .and(($el) => {
                if (i === 7) {
                  expect($el).to.have.prop("tagName", "A");
                  expect($el)
                    .to.have.attr("href")
                    .match(/^\/contract\/renew\/\d+\/\d+$/);
                } else {
                  expect($el).to.have.prop("tagName", "SPAN");
                }
              });
            cy.wrap($el)
              .children()
              .eq(4)
              .should(
                "have.text",
                "480王大明2360東南西北240告五人120蒟蒻bla bla bla"
              );
            cy.wrap($el)
              .children()
              .eq(4)
              .children()
              .eq(0)
              .should("have.css", "color", i === 1 ? firstColor : otherColor);
          });
        if (i === 1) {
          cy.contains(typeText).next().next().should("have.text", "40");
        }
      }
    });
  });

  describe("Modify contract", () => {
    it("should check only 0 period can be deleted", () => {
      cy.visit("/contract/edit/25/0");
      cy.contains("button", "刪除合約").scrollIntoView().should("be.visible");

      for (let i = 1; i <= 6; i++) {
        cy.visit(`/contract/edit/25/${i}`);
        cy.contains("button", "刪除合約").should("not.exist");
      }
    });

    it("should modify contract", () => {
      cy.visit("/contract/edit/25/0");
      cy.get("main").contains("h1", "主合約內容").parent().as("contractForm");
      cy.get("main")
        .contains("h1", "合約金額分配")
        .parent()
        .parent()
        .as("contractDistributionForm");
      cy.get("@contractDistributionForm").children().eq(1).as("partList");

      validateField({
        dom: "@contractForm",
        label: "特殊備註",
        value: "修改後的備註",
      });

      cy.get("@contractDistributionForm")
        .find("#part1_amount")
        .clear()
        .type("25000");

      validateField({
        dom: "@contractDistributionForm",
        label: "主客戶盈餘分配",
        value: "300",
        disabled: true,
      });

      for (let i = 2; i <= 4; i++) {
        cy.get("@contractForm")
          .contains("合約金額與附掛金額總和不符")
          .should("be.visible");
        cy.get("@contractForm")
          .contains("button", "修改合約")
          .should("be.disabled");
        cy.get("@partList")
          .children()
          .eq(i - 1)
          .within(() => {
            const amount = 25000;
            cy.contains(`附掛金額 - ${i}`)
              .next()
              .find("input")
              .clear()
              .type(amount.toString());
            cy.contains(`附掛客戶姓名 - ${i}`)
              .next()
              .children()
              .eq(0)
              .children()
              .eq(0)
              .click()
              .clear();
            cy.contains(`附掛客戶姓名 - ${i}`)
              .next()
              .children()
              .eq(0)
              .find("ul")
              .children()
              .eq(i + 2)
              .click();
            cy.contains(`附掛盈餘分配 - ${i}`)
              .next()
              .find("input")
              .should("have.value", amount * 0.012);
          });
      }

      cy.get("@contractForm")
        .contains("button", "修改合約")
        .should("not.be.disabled")
        .click();
      cy.contains("合約修改成功").should("be.visible");

      cy.location("pathname").should("eq", "/calendar-detail");
      cy.location("search").should("eq", "?date=2024/01/07");
    });

    it("should validate modified contract", () => {
      const firstColor = "rgb(37, 99, 235)";
      const otherColor = "rgb(107, 114, 128)";

      for (let i = 1; i <= 7; i++) {
        const typeText = i === 1 ? "新合約" : "走期約";
        cy.visit(`/calendar-detail?date=2024/0${i}/07`);
        cy.contains(`${i}月7號`).should("be.visible");
        cy.contains(typeText).should("be.visible");
        cy.contains(typeText)
          .next()
          .children()
          .eq(0)
          .each(($el) => {
            cy.wrap($el).children().eq(0).should("have.text", "10");
            cy.wrap($el)
              .children()
              .eq(1)
              .should("have.text", `一般${i - 1}`);
            cy.wrap($el)
              .children()
              .eq(2)
              .should("have.text", "修")
              .should("have.attr", "href")
              .and("match", /^\/contract\/edit\/\d+\/\d+$/);
            cy.wrap($el)
              .children()
              .eq(3)
              .should("have.text", "續")
              .and(($el) => {
                if (i === 7) {
                  expect($el).to.have.prop("tagName", "A");
                  expect($el)
                    .to.have.attr("href")
                    .match(/^\/contract\/renew\/\d+\/\d+$/);
                } else {
                  expect($el).to.have.prop("tagName", "SPAN");
                }
              });
            cy.wrap($el)
              .children()
              .eq(4)
              .should(
                "have.text",
                "300王大明2300洪克林300寫詩羊300歐羊如夯修改後的備註"
              );
            cy.wrap($el)
              .children()
              .eq(4)
              .children()
              .eq(0)
              .should("have.css", "color", i === 1 ? firstColor : otherColor);
          });
        if (i === 1) {
          cy.contains(typeText).next().next().should("have.text", "40");
        }
      }
    });
  });

  describe("Renew contract", () => {
    it("should renew contract", () => {
      cy.visit("/contract/renew/25/6");
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

      cy.get("@contractForm").find("#product_id").select("3"); // 短期特殊合約
      cy.get("@contractForm").find("#total_amount").clear().type("300000");
      cy.get("@contractForm")
        .find("#scheduled_date")
        .should("have.value", "2024-07-07");

      validateField({
        dom: "@contractForm",
        label: "客戶姓名",
        value: "王大明2",
        disabled: true,
      });
      validateField({
        dom: "@contractForm",
        label: "合約金額",
        value: "100000",
        disabled: true,
      });
      validateField({
        dom: "@contractForm",
        label: "合約利率",
        value: "2.5%",
        disabled: true,
      });
      validateField({
        dom: "@contractForm",
        label: "盈餘分配",
        value: "2500",
        disabled: true,
      });
      validateField({
        dom: "@contractForm",
        label: "合約周期",
        value: "2",
        disabled: true,
      });
      validateField({
        dom: "@contractForm",
        label: "特殊備註",
        value: "續約後的備註",
      });

      cy.get("@partList")
        .children()
        .eq(3)
        .within(() => {
          cy.contains("刪除").click();
          cy.get("@partList").children().should("have.length", 4);
        });

      validateField({
        dom: "@contractDistributionForm",
        label: "主客戶金額",
        value: "100000",
      });

      for (let i = 1; i <= 2; i++) {
        cy.get("@contractForm")
          .contains("續約金額與附掛金額總和不符")
          .should("be.visible");
        cy.get("@contractForm")
          .contains("button", "續約")
          .should("be.disabled");
        cy.get("@partList")
          .children()
          .eq(i)
          .within(() => {
            const amount = 100000;
            cy.contains(`附掛金額 - ${i + 1}`)
              .next()
              .find("input")
              .clear()
              .type(amount.toString());
            cy.contains(`附掛客戶姓名 - ${i + 1}`)
              .next()
              .children()
              .eq(0)
              .children()
              .eq(0)
              .click()
              .clear();
            cy.contains(`附掛客戶姓名 - ${i + 1}`)
              .next()
              .children()
              .eq(0)
              .find("ul")
              .children()
              .eq(i)
              .click();
            cy.contains(`附掛盈餘分配 - ${i + 1}`)
              .next()
              .find("input")
              .should("have.value", amount * 0.025);
          });
      }

      cy.get("@contractForm")
        .contains("button", "續約")
        .should("not.be.disabled")
        .click();
      cy.contains("合約續約成功").should("be.visible");

      cy.location("pathname").should("eq", "/calendar-detail");
      cy.location("search").should("eq", "?date=2024/07/07");
    });

    it("should validate renewed contract", () => {
      cy.visit("/calendar-detail?date=2024/07/07");

      const firstColor = "rgb(22, 163, 74)";
      const otherColor = "rgb(107, 114, 128)";

      for (let i = 7; i <= 9; i++) {
        const typeText = i === 7 ? "新合約" : "走期約";
        cy.visit(`/calendar-detail?date=2024/0${i}/07`);
        cy.contains(`${i}月7號`).should("be.visible");
        cy.contains(typeText).should("be.visible");
        cy.contains(typeText)
          .next()
          .children()
          .last()
          .each(($el) => {
            cy.wrap($el).children().eq(0).should("have.text", "30");
            cy.wrap($el)
              .children()
              .eq(1)
              .should("have.text", `特${i - 7}`);
            cy.wrap($el)
              .children()
              .eq(2)
              .should("have.text", "修")
              .should("have.attr", "href")
              .and("match", /^\/contract\/edit\/\d+\/\d+$/);
            cy.wrap($el)
              .children()
              .eq(3)
              .should("have.text", "續")
              .and(($el) => {
                if (i === 9) {
                  expect($el).to.have.prop("tagName", "A");
                  expect($el)
                    .to.have.attr("href")
                    .match(/^\/contract\/renew\/\d+\/\d+$/);
                } else {
                  expect($el).to.have.prop("tagName", "SPAN");
                }
              });
            cy.wrap($el)
              .children()
              .eq(4)
              .should(
                "have.text",
                "2,500王大明22,500東南西北2,500告五人續約後的備註"
              );
            cy.wrap($el)
              .children()
              .eq(4)
              .children()
              .eq(0)
              .should("have.css", "color", i === 7 ? firstColor : otherColor);
          });
        if (i === 1) {
          cy.contains(typeText).next().next().should("have.text", "30");
        }
      }
    });
  });
});
