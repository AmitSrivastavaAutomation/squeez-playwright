const xlsx = require("xlsx");

class HotelPage {
  constructor(page) {
    this.page = page;
  }

  async waitBeforeClick() {
    console.log("⏳ Waiting 1 extra second before click...");
    await this.page.waitForTimeout(1000);
  }

  async clickAndFill(locator, value) {
    if (typeof value !== "string" || value.trim() === "") return;
    await locator.scrollIntoViewIfNeeded();
    await locator.waitFor({ state: "visible", timeout: 3000 });
    await this.waitBeforeClick();
    await locator.click({ delay: 150, force: true });
    await locator.fill(value);
  }

  async login(email, password) {
    await this.page.goto("https://admin.sqzvip.com/auth/login");
    await this.clickAndFill(this.page.getByPlaceholder("Email"), email);
    await this.clickAndFill(this.page.getByPlaceholder("Password"), password);
    await this.page.getByRole("checkbox", { name: /I Accept/i }).check();

    await Promise.all([
      this.page.waitForNavigation({ waitUntil: "networkidle" }),
      this.page.getByRole("button", { name: /Sign In/i }).click(),
    ]);
  }

  async navigateToHotelForm() {
    const categoryMenu = this.page.locator("span.menu-title.fs-2", {
      hasText: "Category",
    });
    await categoryMenu.scrollIntoViewIfNeeded();
    await this.waitBeforeClick();
    await categoryMenu.click({ delay: 150 });

    const hotelTab = this.page.locator("span.menu-title.fs-2", {
      hasText: "Hotels",
    });
    await hotelTab.scrollIntoViewIfNeeded();
    await this.waitBeforeClick();
    await hotelTab.click({ delay: 150 });

    const addButton = this.page.getByRole("button", {
      name: /Add Hotel/i,
    });
    await this.waitBeforeClick();
    await addButton.click({ delay: 150 });
  }

  async selectDropdown(index, inputId, searchValue, matchText) {
    const dropdown = this.page.locator(".css-15noair-control").nth(index);
    await this.waitBeforeClick();
    await dropdown.click({ delay: 150 });

    const input = this.page.locator(`#${inputId}`);
    await input.waitFor({ state: "visible", timeout: 3000 });

    if (searchValue?.trim()) {
      await input.fill(searchValue);
    }

    const option = this.page.locator(
      `div[id^="${inputId.replace("-input", "-option")}"]`,
      { hasText: matchText }
    );

    if ((await option.count()) === 0) {
      throw new Error(`❌ No dropdown option found for "${matchText}" in ${inputId}`);
    }

    await this.waitBeforeClick();
    await option.first().click({ delay: 150 });
  }

  async selectTimezone(searchValue, matchText) {
    const wrapper = this.page.locator(".css-19bb58m").first();
    await this.waitBeforeClick();
    await wrapper.click({ delay: 150 });

    const input = this.page.locator("#react-select-2-input");
    await input.waitFor({ state: "visible", timeout: 3000 });

    if (searchValue?.trim()) {
      await input.fill(searchValue);
    }

    const option = this.page.locator('div[id^="react-select-2-option"]', {
      hasText: matchText,
    });

    if ((await option.count()) === 0) {
      throw new Error(`❌ Timezone option "${matchText}" not found`);
    }

    await this.waitBeforeClick();
    await option.first().click({ delay: 150 });
  }

  async selectInterval(matchText) {
    const page = this.page;

    // Step 1: Try clicking the wrapper reliably
    const wrapper = page.locator(".css-15noair-control").filter({
      hasText: /Please select the squeez interval/i,
    });
    await this.waitBeforeClick();
    await wrapper.first().click({ delay: 150 });

    // Step 2: Safely locate the input
    const input = page.locator('input[id^="react-select"][id$="-input"]').last();
    await input.waitFor({ state: 'visible', timeout: 3000 });
    await input.fill(matchText);
    await page.waitForTimeout(500);

    // Step 3: Select the dropdown option
    const option = page.locator('div[id*="-option-"]', {
      hasText: matchText,
    });

    if ((await option.count()) === 0) {
      const allOptions = await page.locator('div[id*="-option-"]').allTextContents();
      throw new Error(`❌ Interval "${matchText}" not found. Available: ${allOptions.join(', ')}`);
    }

    await this.waitBeforeClick();
    await option.first().click({ delay: 150 });
    console.log(`✅ Interval "${matchText}" selected`);
  }

  async submit() {
    const button = this.page.getByText("Submit");
    await this.waitBeforeClick();
    await button.click({ delay: 150 });
    console.log("✅ Submit button clicked");

    const successLocator = this.page.locator(
      '.toast-message, .alert-success, [role="alert"]',
      { hasText: /success|created/i }
    );

    try {
      await successLocator.waitFor({ timeout: 5000 });
      console.log("✅ Success message detected");
    } catch {
      console.warn("⚠️ No visible success message found after submit.");
    }
  }

  static readExcel(filePath, sheetName) {
    const workbook = xlsx.readFile(filePath);
    const worksheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(worksheet);
  }
}

module.exports = { HotelPage };
