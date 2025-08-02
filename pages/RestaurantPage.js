const { expect } = require("@playwright/test");
const { BasePage } = require("./BasePage");

class RestaurantPage extends BasePage {
  constructor(page, timeout = 10000) {
    super(page, timeout);

    this.page = page;
    this.timeout = timeout;

    // === Form Inputs in Order ===
    this.fields = {
      name: page.locator('input[name="name"]'),
      phone: page.locator('input[type="tel"]:visible'),
      description: page.locator('div.ql-editor[contenteditable="true"][data-placeholder="Write something..."]').first(),
      latitude: page.locator('input[name="latitude"], input[placeholder="Latitude"]'),
      longitude: page.locator('input[name="longitude"], input[placeholder="Longitude"]'),
      addressName: page.locator('input[name="addressName"]'),
      timezone: page.locator("#react-select-2-input"),
      street: page.locator('input[placeholder="Street"]'),
      country: page.locator("#react-select-3-input"),
      state: page.locator("#react-select-4-input"),
      city: page.locator("#react-select-5-input"),
      zip: page.locator('input[placeholder="Zip"]'),
      bookingUrl: page.locator('input[placeholder="Booking URL"]'),
      email: page.locator('input[placeholder="Email"]'),
      type: page.locator('input[name="restaurantType"]'),
      interval: page.locator("#react-select-6-input").first(),
      minThreshold: page.locator('input[name="minThreshold"], input[placeholder="Minimum Threshold Amount"]'),
      minSqueezAmount: page.locator('input[name="minSqueezAmount"], input[placeholder="Auto - Approved Amount (per person)"]'),
      menuUrl: page.locator('input[name="menuUrl"], input[placeholder="Restaurant Menu URL"]'),
      personCount: page.locator('input[name="personCount"], input[placeholder="Please enter the person count"]'),
      maxPrice: page.locator('input[name="maximumPrice"], input[placeholder="Please enter the maximum price"]'),
      categoryItem: page.locator('div.menu-item:has-text("Category")').first(),
      categoryTab: page.locator("span.menu-title.fs-2", { hasText: "Restaurants" }).first(),
      addButton: page.locator("button", { hasText: "Add Restaurant" }).first(),
      submitButton: page.locator('button[type="submit"]:has-text("Submit")'),
    };

    this.dropdownKeyMap = {
      timezone: "timezone",
      country: "country",
      state: "state",
      city: "city",
      interval: "interval",
    };
  }

  // Filling the restaurant form with data
  async fillRestaurantDetails(data) {
    const orderedKeys = [
      "name",
      "phone",
      "description",
      "latitude",
      "longitude",
      ,
      "timezone",
      "addressName",
      "street",
      "country",
      "state",
      "city",
      "zip",
      "bookingUrl",
      "email",
      "type",
      "menuUrl",
      "minThreshold",
      "minSqueezAmount",
      "personCount",
      "maxPrice",
      "interval",
      ,
    ];

    for (const key of orderedKeys) {
      const value = data[key];
      if (!value) continue;

      const field = this.fields[key];
      if (!field) {
        console.warn(`⚠️ No field mapping for: ${key}`);
        continue;
      }

      try {
        if (this.dropdownKeyMap[key]) {
          await field.scrollIntoViewIfNeeded();
          await this.page.waitForTimeout(500);
          await this.click(field);
          await this.fill(field, String(value));
          const option = this.page.locator('div[role="option"]').filter({ hasText: value });
          await option.waitFor({ state: "visible", timeout: 4000 });
          await this.click(option);
          console.log(`✅ Selected dropdown "${key}": ${value}`);
        } else {
          await this.fill(field, String(value));
        }
      } catch (err) {
        console.warn(`❌ Fill failed for "${key}": ${err.message}`);
        await this.page.waitForTimeout(1000); // retry
        try {
          await this.fill(field, String(value));
        } catch (innerErr) {
          console.warn(`⚠️ Retry also failed for "${key}": ${innerErr.message}`);
        }
      }
    }
  }

  async navigateToCategorySection() {
    console.log("🏠 Navigating to dashboard (with session)...");

    await this.page.goto(`${process.env.BASE_URL}/dashboard`, { waitUntil: "domcontentloaded" });

    await this.waitFor(this.fields.categoryItem);
    const isExpanded = await this.fields.categoryItem.evaluate((el) => el.classList.contains("show"));

    if (!isExpanded) {
      await this.click(this.fields.categoryItem.locator(".menu-link").first());
    }

    await this.click(this.fields.categoryTab);
    await this.click(this.fields.addButton);

    console.log("✅ Reached Add Restaurant modal.");
  }

  async submitForm() {
    await this.click(this.fields.submitButton);
    console.log("✅ Restaurant form submitted.");
    //await this.page.pause();
  }

  async addNewRestaurant(data) {
    await this.navigateToCategorySection();
    await this.page.waitForTimeout(1000);
    await this.fillRestaurantDetails(data);
    await this.page.waitForTimeout(1000);
    await this.submitForm();
  }
}

module.exports = { RestaurantPage };
