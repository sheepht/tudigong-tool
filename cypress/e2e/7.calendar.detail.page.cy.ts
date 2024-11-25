describe("Calendar Detail Page Test", () => {
  beforeEach(() => {
    cy.loginAndSetToken();
  });

  describe("calendar detail layout", () => {
    it("should validate calendar detail page all new contract", () => {
      cy.visit("/calendar-detail?date=2024/01/31");
      cy.contains("新合約").next().as("contractList");

      cy.contains("1月31號週三").should("be.visible");
      cy.contains("新合約").should("be.visible");
      cy.contains("回日曆").should("be.visible");

      let totalSum = 0;
      cy.get("@contractList")
        .children()
        .each(($li) => {
          cy.wrap($li).within(() => {
            cy.get("div")
              .first()
              .invoke("text")
              .then((text) => {
                const number = +text;
                totalSum += number;
              });

            cy.get("a")
              .contains("修")
              .should("have.attr", "href")
              .and("match", /^\/contract\/edit\/\d+\/\d+$/);
            cy.get("span")
              .contains("續")
              .should("exist")
              .and("have.prop", "tagName", "SPAN");
            cy.wrap($li)
              .find("ul")
              .should("exist")
              .find("li")
              .each(($innerLi) => {
                cy.wrap($innerLi)
                  .invoke("text")
                  .should("match", /^\d+.+$/);
                cy.wrap($innerLi).should(
                  "have.css",
                  "color",
                  "rgb(37, 99, 235)"
                );
              });
          });
        })
        .then(() => {
          cy.get("@contractList")
            .next()
            .invoke("text")
            .then((text) => {
              const expectedTotal = +text;
              expect(totalSum).to.equal(expectedTotal);
            });
        });
    });

    it("should validate calendar detail page all renew contract", () => {
      cy.visit("/calendar-detail?date=2024/03/06");
      cy.contains("新合約").next().as("contractList");

      cy.contains("3月6號週三").should("be.visible");
      cy.contains("新合約").should("be.visible");
      cy.contains("回日曆").should("be.visible");

      let totalSum = 0;
      cy.get("@contractList")
        .children()
        .each(($li) => {
          cy.wrap($li).within(() => {
            cy.get("div")
              .first()
              .invoke("text")
              .then((text) => {
                const number = +text;
                totalSum += number;
              });

            cy.get("a")
              .contains("修")
              .should("have.attr", "href")
              .and("match", /^\/contract\/edit\/\d+\/\d+$/);
            cy.get("span")
              .contains("續")
              .should("exist")
              .and("have.prop", "tagName", "SPAN");
            cy.wrap($li)
              .find("ul")
              .should("exist")
              .find("li")
              .each(($innerLi) => {
                cy.wrap($innerLi)
                  .invoke("text")
                  .should("match", /^\d+.+$/);
                cy.wrap($innerLi).should(
                  "have.css",
                  "color",
                  "rgb(22, 163, 74)"
                );
              });
          });
        })
        .then(() => {
          cy.get("@contractList")
            .next()
            .invoke("text")
            .then((text) => {
              const expectedTotal = +text;
              expect(totalSum).to.equal(expectedTotal);
            });
        });
    });

    it("should validate calendar detail page all end contract", () => {
      cy.visit("/calendar-detail?date=2024/09/06");
      cy.contains("走期約").next().as("contractList");

      cy.contains("9月6號週五").should("be.visible");
      cy.contains("走期約").should("be.visible");
      cy.contains("回日曆").should("be.visible");

      cy.get("@contractList")
        .children()
        .each(($li) => {
          cy.wrap($li).within(() => {
            cy.get("a")
              .contains("修")
              .should("have.attr", "href")
              .and("match", /^\/contract\/edit\/\d+\/\d+$/);
            cy.get("a")
              .contains("續")
              .should("have.attr", "href")
              .and("match", /^\/contract\/renew\/\d+\/\d+$/);
            cy.wrap($li)
              .find("ul")
              .should("exist")
              .find("li")
              .each(($innerLi) => {
                cy.wrap($innerLi)
                  .invoke("text")
                  .should("match", /^\d+.+$/);
                cy.wrap($innerLi).should(
                  "have.css",
                  "color",
                  "rgb(107, 114, 128)"
                );
              });
          });
        });
    });
  });

  it("should swipe to next day and previous day", () => {
    cy.visit("/calendar-detail?date=2024/09/06");
    cy.contains("回日曆").should("be.visible");
    cy.contains("回日曆").parent().parent().as("block");

    cy.get("@block").then(($block) => {
      const width = $block.width();
      const centerY = $block.height() / 2;

      // 使用 Cypress 命令进行循环
      for (let i = 6; i < 9; i++) {
        cy.get("body")
          .trigger("touchstart", {
            touches: [{ clientX: width - 50, clientY: centerY }],
          })
          .trigger("touchmove", {
            touches: [{ clientX: width / 2, clientY: centerY }],
          })
          .trigger("touchend", {
            touches: [{ clientX: 50, clientY: centerY }],
          });

        // 验证每次滑动后的URL
        cy.url().should("include", `2024/09/${("00" + (i + 1)).slice(-2)}`);
      }

      // 从左至右滑动三次
      for (let i = 9; i > 6; i--) {
        cy.get("body")
          .trigger("touchstart", {
            touches: [{ clientX: 50, clientY: centerY }],
          })
          .trigger("touchmove", {
            touches: [{ clientX: width / 2, clientY: centerY }],
          })
          .trigger("touchend", {
            touches: [{ clientX: width - 50, clientY: centerY }],
          });

        // 验证每次滑动后的URL
        cy.url().should("include", `2024/09/${("00" + (i - 1)).slice(-2)}`);
      }
    });
  });
});
