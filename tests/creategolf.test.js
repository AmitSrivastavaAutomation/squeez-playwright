const { test, expect } = require("@playwright/test");
const { GolfPage } = require("../pages/GolfPage");

test.describe.serial("Golf Creation Flow", () => {
  test("Create golf entry from Excel", async ({ page }) => {
    test.setTimeout(120_000);
    const golfPage = new GolfPage(page);

    const data = await golfPage.getRandomExcelRow("golfData.xlsx", "golfData");
    console.log(`🟢 Loaded random Excel row: ${data.name}`);
    console.log("🧾 Keys:", Object.keys(data));

    console.log("─────────────────────────────────────────────");

    await golfPage.addNewGolf(data);
    console.log(`✅ Golf entry created successfully`);
  });
});
