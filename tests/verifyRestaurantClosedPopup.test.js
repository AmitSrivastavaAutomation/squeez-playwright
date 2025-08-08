const { test, expect } = require("@playwright/test");
const { VerifyClosedPopupPage } = require("../pages/VerifyClosedPopupPage");

test.describe.serial("Verify Squeez Popup when Restaurant is Closed", () => {
  test("Trigger popup when user requests outside restaurant hours", async ({ page, context }) => {
    test.setTimeout(60 * 1000);

    const verifyPage = new VerifyClosedPopupPage(page);

    // Only use VerifyClosedPopupPage class for full flow execution
    await verifyPage.runClosedRestaurantSqueezFlow(context);
  });
});
