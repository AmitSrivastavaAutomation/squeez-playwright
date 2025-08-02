const { test, expect } = require("@playwright/test");
const { HotelPage } = require("../pages/HotelPage");

test.describe.serial("Hotel Creation Flow", () => {
  test("Create hotel from Excel", async ({ page }) => {
    test.setTimeout(120_000);

    const hotelPage = new HotelPage(page);

    const data = await hotelPage.getRandomExcelRow("hotelData.xlsx", "hotelData");
    console.log(`🟢 Loaded random Excel row: ${data.businessName}`);
    console.log("🧾 Keys:", Object.keys(data));

    console.log("─────────────────────────────────────────────");

    await hotelPage.addNewHotel(data);
    console.log(`✅ Hotel entry created successfully`);
  });
});
