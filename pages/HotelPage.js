const { expect } = require("@playwright/test");
const { BasePage } = require("./BasePage");

class HotelPage extends BasePage {
  constructor(page, timeout = 10000) {
    super(page, timeout);

    this.page = page;
    this.timeout = timeout;

    // === Hotel Form Locators (Ordered) ===
    this.fields = {
      businessName: page.locator('input[placeholder="Name"][name="name"]'),
      mobileNumber: page.locator('input[name="phone"], input[placeholder="Mobile Number"]'),
      addressName: page.locator('input[name="addressName"], input[placeholder="Address Name"]'),

      description: page.locator('div.ql-editor[contenteditable="true"][data-placeholder="Write something..."]').first(),
      latitude: page.locator('input[placeholder="Latitude"]'),
      longitude: page.locator('input[placeholder="Longitude"]'),
      bookingPreferences: page.locator("#react-select-1-input"),
      timezone: page.locator("#react-select-2-input"),
      addressName: page.locator('input[placeholder="Address Name"]'),
      street: page.locator('input[placeholder="Street"]'),
      country: page.locator("#react-select-3-input"),
      state: page.locator("#react-select-4-input"),
      city: page.locator("#react-select-5-input"),
      zip: page.locator('input[placeholder="Zip"]'),
      bookingUrl: page.locator('input[placeholder="Booking URL"]'),
      minThreshold: page.locator('input[placeholder="Minimum Threshold Amount"]'),
      maxPerson: page.locator('input[placeholder="Please enter the person count"]'),
      maxPrice: page.locator('input[placeholder="Please enter the maximum price"]'),
      interval: page.locator("#react-select-6-input"),
      // Navigation
      categoryItem: page.locator('div.menu-item:has-text("Category")').first(),
      categoryTab: page.locator("span.menu-title.fs-2", { hasText: "Hotels" }).first(),
      addButton: page.locator('button:has-text("Add Hotel")').first(),
      submitButton: page.locator('button[type="submit"]:has-text("Submit")'),
    };

    // === Dropdown Field Map ===
    this.dropdownKeyMap = {
      bookingPreferences: "bookingPreferences",
      timezone: "timezone",
      country: "country",
      state: "state",
      city: "city",
      interval: "interval",
    };
  }

  // === Fill Form Fields in Specified Order ===
  async fillHotelDetails(data) {
    const orderedKeys = [
      "businessName",
      "mobileNumber",
      "description",
      "latitude",
      "longitude",
      "bookingPreferences",
      "timezone",
      "addressName",
      "street",
      "country",
      "state",
      "city",
      "zip",
      "bookingUrl",
      "minThreshold",
      "maxPerson",
      "maxPrice",
      "interval",
    ];

    for (const key of orderedKeys) {
      const value = data[key];
      if (!value) continue;

      const field = this.fields[key];
      if (!field) {
        console.warn(`⚠️ No field found for key: ${key}`);
        continue;
      }

      try {
        if (key === "description") {
          await field.click({ force: true });
          await field.evaluate((node, val) => {
            node.innerHTML = val;
            node.dispatchEvent(new Event("input", { bubbles: true }));
          }, String(value));
          console.log(`📝 Filled rich text "${key}"`);
        } else if (this.dropdownKeyMap[key]) {
          await field.scrollIntoViewIfNeeded();
          await this.page.waitForTimeout(500);
          await this.click(field);
          await this.fill(field, String(value));
          const option = this.page.locator('div[role="option"]').filter({ hasText: value });
          await option.waitFor({ state: "visible", timeout: 1000 });
          await this.click(option);
          console.log(`✅ Selected dropdown "${key}": ${value}`);
        } else {
          await this.fill(field, String(value));
          console.log(`✅ Filled "${key}": ${value}`);
        }
      } catch (err) {
        console.warn(`❌ Fill failed for "${key}": ${err.message}`);
        await this.page.waitForTimeout(1000);
        try {
          await this.fill(field, String(value));
        } catch (innerErr) {
          console.warn(`⚠️ Retry also failed for "${key}": ${innerErr.message}`);
        }
      }
    }
  }

  // === Navigation to Hotels Category Tab ===
  async navigateToCategorySection() {
    console.log("🏨 Navigating to dashboard...");

    await this.page.goto(`${process.env.BASE_URL}/dashboard`, { waitUntil: "domcontentloaded" });

    await this.waitFor(this.fields.categoryItem);
    const isExpanded = await this.fields.categoryItem.evaluate((el) => el.classList.contains("show"));

    if (!isExpanded) {
      await this.click(this.fields.categoryItem.locator(".menu-link").first());
    }

    await this.click(this.fields.categoryTab);
    await this.click(this.fields.addButton);

    console.log("✅ Reached Add Hotel modal.");
  }

  // === Submit Form ===
  async submitForm() {
    await this.click(this.fields.submitButton);
    console.log("✅ Hotel form submitted.");
    // await this.page.pause(); // Uncomment for debug
  }

  // === Full Flow: Navigate + Fill + Submit ===
  async addNewHotel(data) {
    await this.navigateToCategorySection();
    await this.page.waitForTimeout(1000);
    await this.fillHotelDetails(data);
    await this.page.waitForTimeout(1000);
    await this.submitForm();
  }
}

module.exports = { HotelPage };
