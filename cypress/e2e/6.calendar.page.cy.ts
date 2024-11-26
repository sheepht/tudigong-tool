const RedStart =
  '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" aria-hidden="true" class="inline-block text-red-500" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clip-rule="evenodd"></path></svg>';
const GrayStar =
  '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" aria-hidden="true" class="inline-block" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clip-rule="evenodd"></path></svg>';
const GrayOutStar =
  '<svg stroke="currentColor" fill="none" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true" class="inline-block" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"></path></svg>';

const StartList = [RedStart, GrayStar, GrayOutStar];

describe("Calendar Page Test", () => {
  beforeEach(() => {
    cy.loginAndSetToken();
    cy.viewport("macbook-13");

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

  describe("calendar layout", () => {
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

      it("should calendar date display correct text", () => {
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

  describe("calendar behavior", () => {
    it("should validate drawer button behavior", () => {
      cy.get("@drawerButton").click();
      cy.get("@header")
        .next()
        .should("have.css", "background-color", "rgba(0, 0, 0, 0.5)");
      cy.get("@header")
        .next()
        .next()
        .as("drawer")
        .should("have.css", "z-index", "50");

      cy.get("@header").next().click({ force: true });

      cy.get("@drawer").should("not.exist");
    });

    it("should validate date menu behavior", () => {
      cy.get("@dateMenu").contains("«").click();
      cy.get("@dateMenu")
        .invoke("text")
        .should("match", /^2024 02月«本月»$/);
      cy.location("search").should("eq", "?month=2024%2F02");

      cy.get("@note").should("have.text", " 這是二月的備註 打很長哈哈哈哈哈哈");
      cy.get("@summary").should("have.text", "續 0新 0加 0回 110移 110共 0");

      cy.get("@dateMenu").contains("«").click();
      cy.get("@dateMenu")
        .invoke("text")
        .should("match", /^2024 01月«本月»$/);
      cy.location("search").should("eq", "?month=2024%2F01");

      cy.get("@note").should("have.text", " 這是一月的備註");
      cy.get("@summary").should("have.text", "續 0新 370加 0回 0移 0共 370");

      cy.get("@dateMenu").contains("»").click();
      cy.get("@dateMenu").contains("»").click();
      cy.get("@dateMenu")
        .invoke("text")
        .should("match", /^2024 03月«本月»$/);
      cy.location("search").should("eq", "?month=2024%2F03");
      cy.get("@summary").should(
        "have.text",
        "續 210新 0加 40回 290移 110共 250"
      );

      const currentYear = new Date().getFullYear();
      const currentMonth = ("00" + String(new Date().getMonth() + 1)).slice(-2);

      cy.get("@dateMenu").contains("本月").click();
      cy.get("@dateMenu")
        .invoke("text")
        .should("match", RegExp(`^${currentYear} ${currentMonth}月«本月»$`));
      cy.location("search").should(
        "eq",
        `?month=${currentYear}%2F${currentMonth}`
      );
    });

    it("should validate note behavior", () => {
      cy.get("@note").click();
      cy.get("#root")
        .children()
        .eq(1)
        .as("noteModalBG")
        .should("have.css", "background-color", "rgba(0, 0, 0, 0.5)");
      cy.get("@noteModalBG")
        .children()
        .first()
        .should("have.css", "background-color", "rgb(255, 255, 255)");
      cy.get("@noteModalBG").click({ force: true });
      cy.get("@noteModalBG").should("not.exist");
    });

    it("should validate calendar day behavior", () => {
      cy.get("@calendar")
        .find("tbody td")
        .eq(9)
        .find("div > :first-child")
        .eq(0)
        .click();

      cy.location("pathname").should("eq", "/calendar-detail");
      cy.location("search").should("eq", "?date=2024/03/06");
    });
  });

  describe("calendar drawer", () => {
    beforeEach(() => {
      cy.visit("/calendar?month=2024/01");
      cy.contains("本月").parent().parent().as("header");
      cy.get("@header")
        .children()
        .first()
        .should("be.visible")
        .as("drawerButton");
      cy.get("@drawerButton").click();
      cy.get("@header").next().next().as("drawer");

      cy.get("@drawer").contains("當月異動").next().find("ul").as("changeList");

      cy.get("@drawer").contains("2024/02 到期續約").next().as("renewList");
    });

    it("should validate drawer is display", () => {
      cy.get("@drawer").should("be.visible");
    });

    it("should validate go to customer page", () => {
      cy.get("@drawer").contains("建立新客戶").click();
      cy.location("pathname").should("eq", "/customer");
    });

    it("should validate logout", () => {
      cy.get("@drawer").contains("登出").click();
      cy.location("pathname").should("eq", "/login");
    });

    it("should validate drawer layout", () => {
      cy.get("@drawer").should("be.visible");
      cy.get("@drawer").contains("當月異動").should("be.visible");
      cy.get("@drawer").contains("2024/02 到期續約").should("be.visible");

      cy.get("@changeList").should("be.visible");

      cy.get("@renewList").should("be.visible");

      cy.get("@changeList")
        .find("li")
        .each(($li) => {
          cy.wrap($li)
            .children("span")
            .find("svg")
            .should("have.length", 1)
            .and(($svg) => {
              const html = $svg.prop("outerHTML");
              expect(html).to.be.oneOf(StartList);
            });
          cy.wrap($li)
            .children("label")
            .should("be.visible")
            .find("input[type='checkbox']")
            .should("exist");
          cy.wrap($li)
            .children("div")
            .should("be.visible")
            .invoke("text")
            .should(
              "match",
              new RegExp(
                `(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])(續|新|加|回|移)\\d+.+`
              )
            );
        });

      cy.get("@renewList")
        .find("li")
        .each(($li) => {
          cy.wrap($li)
            .find("a")
            .should("exist")
            .and("have.attr", "href")
            .and("match", /^\/contract\/renew\/\d+\/\d+$/);

          cy.wrap($li)
            .find("a")
            .should("have.css", "color")
            .and("be.oneOf", ["rgb(22, 163, 74)", "rgb(220, 38, 38)"]); // 綠色或紅色

          cy.wrap($li)
            .find("span")
            .invoke("text")
            .should(
              "match",
              new RegExp(`(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])\\d+.+`)
            );
        });
    });

    it("should validate drawer change list behavior", () => {
      cy.get("@changeList")
        .find("li")
        // .eq(0)
        .each(($li) => {
          // 檢查star按鈕由 黑空星 -> 紅實星 -> 黑實星
          for (let i = 0; i < StartList.length; i++) {
            cy.wrap($li)
              .children("span")
              .find("svg")
              .then(($svg) => {
                const starIndex = StartList.indexOf($svg.prop("outerHTML"));
                const nextStarIndex = (starIndex + 1) % StartList.length;

                cy.wrap($svg).click();

                cy.wrap($li)
                  .children("span")
                  .find("svg")
                  .invoke("prop", "outerHTML")
                  .should("eq", StartList[nextStarIndex]);
              });
          }

          // 檢查checked=有刪除線，unchecked=無刪除線
          for (let i = 0; i < 2; i++) {
            cy.wrap($li)
              .find("input[type='checkbox']")
              .invoke("prop", "checked")
              .then((checked) => {
                cy.wrap($li)
                  .children("div")
                  .should(
                    "have.css",
                    "text-decoration-line",
                    checked ? "line-through" : "none"
                  );
                cy.wrap($li).children("label").click();
              });
          }
        });
    });
  });

  describe("calendar note", () => {
    beforeEach(() => {
      cy.visit("/calendar?month=2024/01");
      cy.contains("本月").parent().parent().as("header");
      cy.get("@header").children().eq(3).should("be.visible").as("note");
      cy.get("@note").click();
      cy.get("#root").children().eq(1).as("noteModalBG");

      cy.get("@noteModalBG").children().first().as("noteModal");
    });
    it("should validate note layout", () => {
      cy.get("@noteModal").contains("本月備註").should("be.visible");
      cy.get("@noteModal")
        .find("textarea")
        .should("have.value", "這是一月的備註");
      cy.get("@noteModal").contains("取消").should("be.visible");
      cy.get("@noteModal").contains("更新").should("be.visible");
    });

    it("should validate note should by month", () => {
      cy.get("@noteModalBG").click({ force: true });
      cy.get("@noteModalBG").should("not.exist");
      cy.contains("»").click({ force: true });

      cy.wait(1000);

      cy.get("@note").click();
      cy.get("@noteModal")
        .find("textarea")
        .should("have.value", "這是二月的備註 打很長哈哈哈哈哈哈");
    });

    it("should validate note update", () => {
      const ts = Date.now();
      cy.contains("»").click({ force: true });
      cy.contains("»").click({ force: true });
      cy.contains("»").click({ force: true });
      cy.get("@note").should("be.visible").click();
      cy.get("@noteModal")
        .find("textarea")
        .clear()
        .type(`這是四月的備註 ${ts}`);
      cy.get("@noteModal").contains("更新").click();
      cy.get("@note").should("have.text", ` 這是四月的備註 ${ts}`);
    });
  });
});
