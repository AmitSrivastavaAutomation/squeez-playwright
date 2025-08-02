const { expect } = require("@playwright/test");
const { BasePage } = require("./BasePage");

class GolfPage extends BasePage {
  constructor(page, timeout = 10000) {
    super(page, timeout);
    this.page = page;
    this.timeout = timeout;

    // === All Required Field Locators ===
    this.fields = {
      name: page.locator('input[name="name"]'),
      type: page.locator('select[name="type"]'),
      golfType: page.locator('select[name="golfType"]'),
      latitude: page.locator('input[placeholder="Latitude"]'),
      longitude: page.locator('input[placeholder="Longitude"]'),
      timezone: page.locator("#react-select-2-input"),
      addressName: page.locator('input[name="addressName"]'),
      street: page.locator('input[placeholder="Street"]'),
      country: page.locator("#react-select-3-input"),
      state: page.locator("#react-select-4-input"),
      city: page.locator("#react-select-5-input"),
      zip: page.locator('input[placeholder="Zip"]'),
      bookingUrl: page.locator('input[placeholder="Booking URL"]'),
      phone: page.locator('input[type="tel"]'),
      minThreshold: page.locator('input[placeholder="Minimum Threshold Amount"]'),
      autoApprovedAmount: page.locator('input[placeholder^="Auto - Approved Amount"]'),
      personCount: page.locator('input[placeholder="Please enter the person count"]'),
      maxPrice: page.locator('input[placeholder="Please enter the maximum price"]'),
      interval: page.locator("#react-select-6-input"),

      // Sidebar Nav
      categoryItem: page.locator('div.menu-item:has-text("Category")').first(),
      golfTab: page.locator("span.menu-title.fs-2", { hasText: "Golf" }).first(),
      addButton: page.locator('button:has-text("Add Golf")').first(),
      submitButton: page.locator('button[type="submit"]:has-text("Submit")'),
    };

    // Field types map
    this.fieldTypeMap = {
      type: "select",
      golfType: "select",
      timezone: "dropdown",
      country: "dropdown",
      state: "dropdown",
      city: "dropdown",
      interval: "dropdown",
      description: "richText",
      privacyDescription: "richText",
      rulesDescription: "richText",
      teeTimeDescription: "richText",
      teeTimePolicy: "richText",
    };

    // Rich text editor locator order
    this.richTextOrder = ["description", "privacyDescription", "rulesDescription", "teeTimeDescription", "teeTimePolicy"];
  }

  async fillGolfDetails(data) {
    const orderedKeys = [
      "name",
      "type",
      "golfType",
      "latitude",
      "longitude",
      "timezone",
      "addressName",
      "street",
      "country",
      "state",
      "city",
      "zip",
      "description",
      "privacyDescription",
      "rulesDescription",
      "teeTimeDescription",
      "teeTimePolicy",
      "bookingUrl",
      "phone",
      "minThreshold",
      "autoApprovedAmount",
      "personCount",
      "maxPrice",
      "interval",
    ];

    for (const key of orderedKeys) {
      const rawValue = data[key];
      if (!rawValue) continue;

      const value = String(rawValue).trim();
      const field = this.fields[key];
      const fieldType = this.fieldTypeMap[key] || "input";

      try {
        if (fieldType === "richText") {
          const index = this.richTextOrder.indexOf(key);
          const editor = this.page.locator(".ql-editor").nth(index);
          await editor.click({ force: true });
          await editor.evaluate((node, val) => {
            node.innerHTML = val;
            node.dispatchEvent(new Event("input", { bubbles: true }));
          }, value);
          console.log(`📝 Filled rich text "${key}"`);
        } else if (fieldType === "select") {
          await field.selectOption({ label: value });
          console.log(`📘 Selected <select> "${key}": ${value}`);
        } else if (fieldType === "dropdown") {
          await field.click({ force: true });
          await field.fill(value);
          await this.page.waitForTimeout(300);
          await field.press("Enter");
          console.log(`📗 Selected dropdown "${key}": ${value}`);
        } else {
          await this.fill(field, value);
          console.log(`✅ Filled input "${key}": ${value}`);
        }

        await this.page.waitForTimeout(800);
      } catch (err) {
        console.warn(`❌ Error filling "${key}": ${err.message}`);
      }
    }
  }

  async navigateToCategorySection() {
    console.log("📂 Navigating to Golf tab from sidebar...");
    await this.page.goto(`${process.env.BASE_URL}/dashboard`, { waitUntil: "domcontentloaded" });
    await this.waitFor(this.fields.categoryItem);

    const isExpanded = await this.fields.categoryItem.evaluate((el) => el.classList.contains("show"));
    if (!isExpanded) {
      await this.click(this.fields.categoryItem.locator(".menu-link").first());
    }

    await this.click(this.fields.golfTab);
    await this.click(this.fields.addButton);
    console.log("✅ Reached Add Golf modal.");
  }

  async submitForm() {
    await this.click(this.fields.submitButton);
    console.log("✅ Golf form submitted.");
    // await this.page.pause();
  }

  async addNewGolf(data) {
    await this.navigateToCategorySection();
    await this.page.waitForTimeout(800);
    await this.fillGolfDetails(data);
    await this.page.waitForTimeout(800);
    await this.submitForm();
  }
}

module.exports = { GolfPage };
