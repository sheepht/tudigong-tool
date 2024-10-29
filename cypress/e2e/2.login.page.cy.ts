describe("Login Page Test", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("should check if username and password fields exist", () => {
    // 檢查使用者名稱和密碼欄位是否存在
    cy.get("#username").should("exist");
    cy.get("#password").should("exist");
  });

  it("should find login form", () => {
    // 檢查表單是否存在
    cy.get("form").should("exist");

    // 檢查表單是否有提交按鈕
    cy.get("form").find("button[type='submit']").should("exist");
  });

  it("should display validation messages when submitting an empty form", () => {
    // 嘗試提交空表單
    cy.get("form").submit();

    // 驗證表單未被提交（URL應該保持不變）
    cy.url().should("include", "/login");

    // 檢查使用者名稱欄位是否顯示必填提示
    cy.get("#username:invalid")
      .invoke("prop", "validationMessage")
      .should("not.be.empty");

    // 在使用者名稱欄位中輸入隨機字串
    cy.get("#username").type(Math.random().toString(36).substring(7));

    // 再次點擊提交按鈕
    cy.get("form").submit();

    // 驗證表單仍未被提交（URL應該保持不變）
    cy.url().should("include", "/login");

    // 檢查密碼欄位是否顯示必填提示
    cy.get("#password:invalid")
      .invoke("prop", "validationMessage")
      .should("not.be.empty");
  });

  it("should display error message when submitting incorrect login information", () => {
    // 輸入錯誤的用戶名和密碼
    cy.get("#username").type("錯誤用戶名");
    cy.get("#password").type("錯誤密碼");

    // 提交表單
    cy.get("form").submit();

    // 驗證URL沒有改變（未成功登錄）
    cy.url().should("include", "/login");

    // 檢查是否顯示錯誤消息
    cy.get("#msg-error").should("be.visible").and("contain", "登入失敗");

    // 確保用戶名和密碼欄位仍然存在
    cy.get("#username").should("exist");
    cy.get("#password").should("exist");
  });

  it("should successfully login when submitting correct login information", () => {
    // 輸入正確的用戶名和密碼
    cy.get("#username").type("sexyoung");
    cy.get("#password").type("test");

    // 提交表單
    cy.get("form").submit();

    // 驗證URL已經改變（成功登錄後應該跳轉到其他頁面）
    cy.url().should("not.include", "/login");

    // 檢查是否顯示歡迎消息或其他登錄成功的標誌
    cy.url().should("include", "/calendar");
  });
});
