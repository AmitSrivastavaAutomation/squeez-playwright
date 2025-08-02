// const { test } = require("@playwright/test");
// const SqueezPage = require("../../pages/SqueezPage");

// test("Click Squeez tab > Select Pending status > Validate table results", async ({ page }) => {
//   await test.step("Login to application", async () => {
//     await page.goto("https://admin.sqzvip.com/auth/login");
//     await page.getByPlaceholder("Email").fill("legalsqueez@yopmail.com");
//     await page.getByPlaceholder("Password").fill("Welcome@1");
//     await page.getByRole("checkbox", { name: /I Accept/i }).check();

//     await Promise.all([page.waitForURL("**/dashboard", { waitUntil: "networkidle" }), page.getByRole("button", { name: /Sign In/i }).click()]);
//   });

//   const squeezPage = new SqueezPage(page);

//   await test.step("Navigate to Squeez page", async () => {
//     await squeezPage.navigateToSqueezPage();
//   });

//   await test.step("Filter by Pending status", async () => {
//     await squeezPage.selectStatus("Pending");
//   });

//   await test.step("Validate all results show Pending status", async () => {
//     await squeezPage.validateAllStatuses("Pending");
//   });
// });
