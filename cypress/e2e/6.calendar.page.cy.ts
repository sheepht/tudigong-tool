describe("Calendar Page Test", () => {
  beforeEach(() => {
    cy.loginAndSetToken();
    cy.viewport("macbook-13");
  });

  describe("calendar layout", () => {
    beforeEach(() => {
      cy.visit("/calendar?month=2024/03");

      cy.contains("本月").parent().parent().as("header");
      cy.get("@header").next().find("table").as("calendar");

      // 第一個是drawer選單
      cy.get("@header")
        .children()
        .first()
        .should("be.visible")
        .as("drawerButton");
      // 第二個是日期選單
      cy.get("@header").children().eq(1).should("be.visible").as("dateMenu");
      // 第三個是金額summary
      cy.get("@header").children().eq(2).should("be.visible").as("summary");
      // 第四個是 note
      cy.get("@header").children().eq(3).should("be.visible").as("note");
    });

    it("should display calendar page url", () => {
      cy.location("pathname").should("eq", "/calendar");
      cy.location("search").should("eq", "?month=2024%2F03");
    });

    describe("header", () => {
      it("should date menu display correct text", () => {
        cy.get("@dateMenu")
          .invoke("text")
          .should("match", /^2024 03月«本月»$/);

        cy.get("@dateMenu").children().eq(0).should("have.text", "«");
        cy.get("@dateMenu").children().eq(1).should("have.text", "本月");
        cy.get("@dateMenu").children().eq(2).should("have.text", "»");
      });

      it("should summary display correct text", () => {
        const summaryText = ["續", "新", "加", "回", "移", "共"];
        summaryText.forEach((text, index) => {
          cy.get("@summary")
            .find("ul")
            .children()
            .eq(index)
            .invoke("text")
            .should("match", new RegExp(`^${text} \\d+$`));
        });
      });

      it("should note display correct text", () => {
        cy.get("@note").invoke("text").should("eq", " 新增備註");
      });
    });

    describe("calendar", () => {
      it("should calendar weekday display correct text", () => {
        cy.get("@calendar").should("be.visible");
        cy.get("@calendar")
          .find("thead th")
          .should("have.length", 7)
          .each(($th, index) => {
            const weekdays = [
              "周一",
              "周二",
              "周三",
              "周四",
              "周五",
              "周六",
              "周日",
            ];
            cy.wrap($th).should("have.text", weekdays[index]);
          });

        cy.get("@calendar")
          .find("thead th")
          .eq(5)
          .find("span")
          .should("have.css", "color", "rgb(22, 163, 74)"); // 周六綠色

        cy.get("@calendar")
          .find("thead th")
          .eq(6)
          .find("span")
          .should("have.css", "color", "rgb(220, 38, 38)"); // 周日紅色

        cy.get("@calendar")
          .find("thead th")
          .eq(2)
          .find("a")
          .should("exist") // 周三有超連結
          .and("have.attr", "href", "/contract/create");
      });

      it.only("should calendar date display correct text", () => {
        cy.get("@calendar").find("tbody td").should("have.length", 35);

        cy.get("@calendar")
          .find("tbody td")
          .each(($td, index) => {
            const day = index < 4 ? index + 26 : index - 3;
            // 驗證日期
            cy.wrap($td)
              .find("div > :first-child")
              .eq(0)
              .invoke("text")
              .should("eq", day.toString());

            // 驗證每個日期裡的合約格式為 [合約編號] [合約金額+人名]*n
            cy.wrap($td)
              .find("ul")
              .should("have.length.gte", 0)
              .each(($ul) => {
                cy.wrap($ul)
                  .find("li")
                  .should("have.length.gte", 0)
                  .each(($li) => {
                    cy.wrap($li)
                      .children()
                      .eq(0)
                      .invoke("text")
                      .should("match", /^\d+$/);

                    cy.wrap($li)
                      .children()
                      .eq(1)
                      .invoke("text")
                      .should("match", /^\d+(,\d+)* .+$/);
                  });
              });

            // 如果 index 是 6, 13, 20, 27, 34... 則要驗證 td>div>第3個元素的內容為$金額格式
            if (index % 7 === 6) {
              cy.wrap($td)
                .children()
                .eq(0)
                .children()
                .eq(2)
                .invoke("text")
                .should("match", /^\$\d+(,\d+)*$/);
            }
          });
      });
    });
  });
});
