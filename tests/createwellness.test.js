// const { test, expect } = require("@playwright/test");
// const { WellnessPage } = require("../../pages/WellnessPage.js");
// const path = require("path");
// const fs = require("fs");

// // Load Excel data
// const filePath = path.resolve("D:/wellnessData.xlsx");
// const sheetName = "wellnessData";
// const wellnessList = WellnessPage.readExcel(filePath, sheetName);
// if (!wellnessList.length) throw new Error("❌ Excel file contains no data.");

// // Track current index
// const indexFile = path.resolve("wellnessDataIndex.json");
// let currentIndex = 0;
// if (fs.existsSync(indexFile)) {
//   const saved = JSON.parse(fs.readFileSync(indexFile, "utf8"));
//   currentIndex = (saved.index + 1) % wellnessList.length;
// }
// fs.writeFileSync(indexFile, JSON.stringify({ index: currentIndex }));

// const wellnessData = wellnessList[currentIndex];

// test("Login and create new wellness entry from Excel", async ({ page }) => {
//   test.setTimeout(180000); // 3 min timeout

//   const wellnessPage = new WellnessPage(page);
//   console.log(`🧪 Using Excel row #${currentIndex + 1}: ${wellnessData.name}`);

//   await wellnessPage.login("legalsqueez@yopmail.com", "Welcome@1");
//   await wellnessPage.navigateToForm();

//   await page.screenshot({
//     path: `before-fill-wellness-${currentIndex + 1}.png`,
//     fullPage: true,
//   });

//   await wellnessPage.fillForm(wellnessData);

//   await page.screenshot({
//     path: `before-submit-wellness-${currentIndex + 1}.png`,
//     fullPage: true,
//   });
//   await wellnessPage.submit();
//   await page.screenshot({
//     path: `after-submit-wellness-${currentIndex + 1}.png`,
//     fullPage: true,
//   });

//   const successMessage = page.locator('.toast-message, .alert-success, [role="alert"]', {
//     hasText: /success|wellness created|added|created successfully/i,
//   });

//   try {
//     await expect(successMessage).toBeVisible({ timeout: 10000 });
//     console.log("✅ Success message found.");
//   } catch (err) {
//     console.warn("⚠️ No visible success message found. Checking fallback...");
//     const heading = page.locator("h1, .page-heading", { hasText: "Wellness" });
//     await expect(heading).toBeVisible({ timeout: 5000 });
//     console.log("✅ Redirected to wellness list. Assuming success.");
//   }
// });
