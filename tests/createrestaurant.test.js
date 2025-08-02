const { test, expect } = require("@playwright/test");
const { RestaurantPage } = require("../pages/RestaurantPage");

test.describe.serial("Restaurant Creation Flow", () => {
  test("Create restaurant from Excel", async ({ page }) => {
    test.setTimeout(60 * 1000);

    const restaurantPage = new RestaurantPage(page);

    const data = await restaurantPage.getRandomExcelRow("restaurantData.xlsx", "restaurantData");
    console.log(`🟢 Loaded random Excel row: ${data.name}`);
    console.log("🧾 Keys:", Object.keys(data));

    console.log("─────────────────────────────────────────────");

    await restaurantPage.addNewRestaurant(data);
    console.log(`✅ Restaurant added successfully`);
  });
});
