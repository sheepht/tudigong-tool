describe("Customer Page Test", () => {
  beforeEach(() => {
    cy.loginAndSetToken();
  });

  describe("product list page", () => {
    beforeEach(() => {
      cy.visit("/product");
      cy.get("main").contains("h1", "建立產品").parent().as("productForm");
      cy.get("main")
        .contains("h1", "產品列表")
        .should("be.visible")
        .parent()
        .parent()
        .as("productList");

      cy.get("@productForm")
        .contains("label", "產品代號")
        .should("be.visible")
        .next()
        .find("input")
        .as("companyId");

      cy.get("@productForm")
        .contains("label", "產品名稱")
        .should("be.visible")
        .next()
        .find("input")
        .as("productName");

      cy.get("@productForm")
        .contains("label", "產品簡稱")
        .should("be.visible")
        .next()
        .find("input")
        .as("shortName");

      cy.get("@productForm")
        .contains("label", "合約利率(月)")
        .should("be.visible")
        .next()
        .find("input")
        .as("interestRateMonthly");

      cy.get("@productForm")
        .contains("label", "合約週期(月)")
        .should("be.visible")
        .next()
        .find("input")
        .as("periodMonthly");

      cy.get("@productForm")
        .contains("label", "按鈕顯示顏色")
        .should("be.visible")
        .next()
        .find("input")
        .as("buttonColor");

      cy.get("@productForm")
        .contains("新合約預設產品")
        .should("be.visible")
        .prev()
        .find('input[type="checkbox"]')
        .as("defaultProduct");

      cy.get("@productList").find("input").as("searchInput");
    });
    it("should display product page url", () => {
      cy.location("pathname").should("eq", "/product");
    });

    it("should display create contract, create customer, create product text", () => {
      cy.checkNavigationLinks();
    });

    it("should display product form", () => {
      cy.get("@companyId")
        .should("exist")
        .and("have.attr", "placeholder", "大寫英文 or 符號 or 數字 共10個字");
      cy.get("@productName")
        .should("exist")
        .and("have.attr", "placeholder", "限定20個字");
      cy.get("@shortName")
        .should("exist")
        .and("have.attr", "placeholder", "限定2個字");
      cy.get("@interestRateMonthly")
        .should("exist")
        .and("have.attr", "placeholder", "請輸入小於100的數字");
      cy.get("@periodMonthly")
        .should("exist")
        .and("have.attr", "placeholder", "整數");
      cy.get("@buttonColor")
        .should("exist")
        .and("have.attr", "value", "#eeeeee");
      cy.get("@defaultProduct").should("exist").and("not.be.checked");
      cy.get("@productForm").contains("button", "建立產品").should("exist");
    });

    it("should display product list", () => {
      cy.get("@searchInput")
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
            "編輯",
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
            cy.get("td")
              .eq(1)
              .should("not.be.empty")
              .and("have.length.lte", 20);

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

      cy.get("@searchInput").clear().type("合約");
      cy.get("@productList").find("table tbody tr").should("have.length", 3);
      cy.get("@searchInput").clear().type("一般");
      cy.get("@productList").find("table tbody tr").should("have.length", 2);
      cy.get("@searchInput").clear().type("超特");
      cy.get("@productList").find("table tbody tr").should("have.length", 1);
    });

    it("should validate create product form", () => {
      // 送出表單
      cy.get("@productForm").find("button").click();

      // 驗證產品代號欄位有 required 提示
      cy.get("@companyId")
        .invoke("prop", "validationMessage")
        .should("not.be.empty");

      cy.get("@companyId").type("TEST-006");

      // 再次送出表單
      cy.get("@productForm").find("button").click();

      // 驗證產品名稱欄位有 required 提示
      cy.get("@productName")
        .invoke("prop", "validationMessage")
        .should("not.be.empty");

      cy.get("@productName").type("測試合約");

      // 再次送出表單
      cy.get("@productForm").find("button").click();

      // 驗證產品簡稱欄位有 required 提示
      cy.get("@shortName")
        .invoke("prop", "validationMessage")
        .should("not.be.empty");

      cy.get("@shortName").type("測試");

      ["", "AA", "10.", "100.1", "101", "  "].forEach((interestRateMonthly) => {
        if (interestRateMonthly !== "") {
          cy.get("@interestRateMonthly").clear().type(interestRateMonthly);
        }

        // 再次送出表單
        cy.get("@productForm").find("button").click();

        cy.get("@interestRateMonthly")
          .invoke("prop", "validationMessage")
          .should("not.be.empty");
      });

      cy.get("@interestRateMonthly").clear().type("15");

      ["", "AA", "10.", "#", "@", "  "].forEach((periodMonthly) => {
        if (periodMonthly !== "") {
          cy.get("@periodMonthly").clear().type(periodMonthly);
        }

        // 再次送出表單
        cy.get("@productForm").find("button").click();

        cy.get("@periodMonthly")
          .invoke("prop", "validationMessage")
          .should("not.be.empty");
      });

      cy.get("@periodMonthly").clear().type("6");

      cy.get("@buttonColor").click();
      cy.get("@buttonColor").next(".popover").should("be.visible");

      cy.get("@buttonColor")
        .next(".popover")
        .find(".react-colorful__saturation")
        .as("saturation");

      cy.get("@buttonColor")
        .next(".popover")
        .find(".react-colorful__hue")
        .as("hue");

      cy.get("@saturation").then(($saturation) => {
        cy.get("@hue").then(($hue) => {
          const hueWidth = $hue.width();
          const saturationWidth = $saturation.width();
          const saturationHeight = $saturation.height();
          for (let index = 0; index < 10; index++) {
            cy.get("@hue").click(Math.random() * (hueWidth - 6), 0);
            cy.get("@saturation").click(
              Math.random() * (saturationWidth - 6),
              Math.random() * (saturationHeight - 6)
            );
            cy.get("@buttonColor")
              .should("have.attr", "value")
              .and("match", /^#[0-9A-F]{6}$/i);
          }

          cy.get("@hue").click(hueWidth * 0.15, 0);
          cy.get("@saturation").click(saturationWidth - 6, 0);
        });
      });

      cy.get("main").click();

      cy.get("@defaultProduct").parent().click();
      cy.get("@defaultProduct").should("be.checked");

      cy.get("@defaultProduct").parent().click();
      cy.get("@defaultProduct").should("not.be.checked");
    });

    it("should create product successfully", () => {
      cy.get("@companyId").type("TEST-006");
      cy.get("@productName").type("測試合約");
      cy.get("@shortName").type("測試");
      cy.get("@interestRateMonthly").clear().type("15");
      cy.get("@periodMonthly").clear().type("6");

      cy.get("@buttonColor").click();
      cy.get("@buttonColor").next(".popover").should("be.visible");

      cy.get("@buttonColor")
        .next(".popover")
        .find(".react-colorful__saturation")
        .as("saturation");

      cy.get("@buttonColor")
        .next(".popover")
        .find(".react-colorful__hue")
        .as("hue");

      cy.get("@saturation").then(($saturation) => {
        cy.get("@hue").then(($hue) => {
          const hueWidth = $hue.width();
          const saturationWidth = $saturation.width();
          cy.get("@hue").click(hueWidth * 0.15, 0);
          cy.get("@saturation").click(saturationWidth - 6, 0);
        });
      });

      cy.get("main").click();

      let buttonColorValue;
      cy.get("@buttonColor")
        .invoke("val")
        .then((value: string) => {
          buttonColorValue = value
            .replace("#", "")
            .match(/.{2}/g)
            .map((x) => parseInt(x, 16));
          buttonColorValue = `rgb(${buttonColorValue[0]}, ${buttonColorValue[1]}, ${buttonColorValue[2]})`;
        });

      cy.get("@defaultProduct").parent().click();
      cy.get("@defaultProduct").should("be.checked");

      cy.get("@productForm").contains("button", "建立產品").click();

      // 驗證頁面是否跳轉到產品列表頁面
      cy.location("pathname").should("eq", "/product");

      cy.get("@productList").find("table tbody tr").should("have.length", 6);

      cy.get("@productList")
        .find("table tbody tr")
        .first()
        .within(() => {
          // 檢查代號
          cy.get("td").eq(0).invoke("text").should("eq", "TEST-006");

          // 檢查名稱
          cy.get("td").eq(1).invoke("text").should("eq", "測試合約");

          // 檢查簡稱
          cy.get("td").eq(2).invoke("text").should("eq", "測試");

          // 檢查利率(月)
          cy.get("td").eq(3).invoke("text").should("eq", "15%");

          // 檢查周期
          cy.get("td").eq(4).invoke("text").should("eq", "6");

          // 檢查顏色
          cy.get("td")
            .eq(5)
            .find("div")
            .should("have.attr", "style")
            .and("include", `background-color: ${buttonColorValue}`);
          // 檢查預設
          cy.get("td").eq(6).invoke("text").should("eq", "v");
        });
    });
  });

  describe("modify product page", () => {
    beforeEach(() => {
      cy.visit("/product/edit/6");
      cy.get("main").contains("h1", "修改產品").parent().as("productForm");

      cy.get("@productForm")
        .contains("label", "產品代號")
        .should("be.visible")
        .next()
        .find("input")
        .as("companyId");

      cy.get("@productForm")
        .contains("label", "產品名稱")
        .should("be.visible")
        .next()
        .find("input")
        .as("productName");

      cy.get("@productForm")
        .contains("label", "產品簡稱")
        .should("be.visible")
        .next()
        .find("input")
        .as("shortName");

      cy.get("@productForm")
        .contains("label", "合約利率(月)")
        .should("be.visible")
        .next()
        .find("input")
        .as("interestRateMonthly");

      cy.get("@productForm")
        .contains("label", "合約週期(月)")
        .should("be.visible")
        .next()
        .find("input")
        .as("periodMonthly");

      cy.get("@productForm")
        .contains("label", "按鈕顯示顏色")
        .should("be.visible")
        .next()
        .find("input")
        .as("buttonColor");

      cy.get("@productForm")
        .contains("新合約預設產品")
        .should("be.visible")
        .prev()
        .find('input[type="checkbox"]')
        .as("defaultProduct");
    });

    it("should modify product page display correct product information", () => {
      cy.get("@companyId").should("have.value", "TEST-006");
      cy.get("@productName").should("have.value", "測試合約");
      cy.get("@shortName").should("have.value", "測試");
      cy.get("@interestRateMonthly").should("have.value", "15");
      cy.get("@periodMonthly").should("have.value", "6");
      cy.get("@buttonColor").should("have.value", "#ffe608");
      cy.get("@defaultProduct").should("be.checked");
    });

    it("should validate modify product form", () => {
      cy.get("@companyId").clear();
      cy.get("@productName").clear();
      cy.get("@shortName").clear();
      // 送出表單
      cy.get("@productForm").find("button").click();

      // 驗證產品代號欄位有 required 提示
      cy.get("@companyId")
        .invoke("prop", "validationMessage")
        .should("not.be.empty");

      cy.get("@companyId").type("TEST-006");

      // 再次送出表單
      cy.get("@productForm").find("button").click();

      // 驗證產品名稱欄位有 required 提示
      cy.get("@productName")
        .invoke("prop", "validationMessage")
        .should("not.be.empty");

      cy.get("@productName").type("測試合約");

      // 再次送出表單
      cy.get("@productForm").find("button").click();

      // 驗證產品簡稱欄位有 required 提示
      cy.get("@shortName")
        .invoke("prop", "validationMessage")
        .should("not.be.empty");

      cy.get("@shortName").type("測試");

      cy.get("@buttonColor").click();
      cy.get("@buttonColor").next(".popover").should("be.visible");

      cy.get("@buttonColor")
        .next(".popover")
        .find(".react-colorful__saturation")
        .as("saturation");

      cy.get("@buttonColor")
        .next(".popover")
        .find(".react-colorful__hue")
        .as("hue");

      cy.get("@saturation").then(($saturation) => {
        cy.get("@hue").then(($hue) => {
          const hueWidth = $hue.width();
          const saturationWidth = $saturation.width();
          const saturationHeight = $saturation.height();
          for (let index = 0; index < 10; index++) {
            cy.get("@hue").click(Math.random() * (hueWidth - 6), 0);
            cy.get("@saturation").click(
              Math.random() * (saturationWidth - 6),
              Math.random() * (saturationHeight - 6)
            );
            cy.get("@buttonColor")
              .should("have.attr", "value")
              .and("match", /^#[0-9A-F]{6}$/i);
          }

          cy.get("@hue").click(hueWidth * 0.15, 0);
          cy.get("@saturation").click(saturationWidth - 6, 0);
        });
      });

      cy.get("main").click();

      cy.get("@defaultProduct").parent().click();
      cy.get("@defaultProduct").should("not.be.checked");

      cy.get("@defaultProduct").parent().click();
      cy.get("@defaultProduct").should("be.checked");
    });

    it("should modify product successfully", () => {
      cy.get("@companyId").clear().type("TEST-006-2");
      cy.get("@productName").clear().type("測試合約2");
      cy.get("@shortName").clear().type("測2");

      cy.get("@buttonColor").click();

      cy.get("@buttonColor")
        .next(".popover")
        .find(".react-colorful__saturation")
        .as("saturation");

      cy.get("@buttonColor")
        .next(".popover")
        .find(".react-colorful__hue")
        .as("hue");

      cy.get("@saturation").then(($saturation) => {
        cy.get("@hue").then(($hue) => {
          const hueWidth = $hue.width();
          const saturationWidth = $saturation.width();

          cy.get("@hue").click(hueWidth * 0.5, 0);
          cy.get("@saturation").click(saturationWidth - 6, 0);
        });
      });

      cy.get("main").click();

      cy.get("@buttonColor").should("have.value", "#08ffff");

      cy.get("@defaultProduct").parent().click();
      cy.get("@defaultProduct").should("not.be.checked");

      cy.get("@productForm").contains("button", "修改產品").click();

      // 驗證頁面是否跳轉到產品列表頁面
      cy.location("pathname").should("eq", "/product");

      cy.get("main")
        .contains("h1", "產品列表")
        .should("be.visible")
        .parent()
        .parent()
        .as("productList");

      cy.get("@productList").find("table tbody tr").should("have.length", 6);

      cy.get("@productList")
        .find("table tbody tr")
        .first()
        .within(() => {
          // 檢查代號
          cy.get("td").eq(0).invoke("text").should("eq", "TEST-006-2");

          // 檢查名稱
          cy.get("td").eq(1).invoke("text").should("eq", "測試合約2");

          // 檢查簡稱
          cy.get("td").eq(2).invoke("text").should("eq", "測2");

          // 檢查利率(月)
          cy.get("td").eq(3).invoke("text").should("eq", "15%");

          // 檢查周期
          cy.get("td").eq(4).invoke("text").should("eq", "6");

          // 檢查顏色
          cy.get("td")
            .eq(5)
            .find("div")
            .should("have.attr", "style")
            .and("include", "background-color: rgb(8, 255, 255)");
          // 檢查預設
          cy.get("td").eq(6).invoke("text").should("eq", "");
        });
    });
  });
});
