class GolfPage {
  constructor(page) {
    this.page = page;
  }

  async login(email, password) {
    await this.page.getByPlaceholder("Email").fill(email);
    await this.page.getByPlaceholder("Password").fill(password);
    await this.page.getByRole("checkbox", { name: /I Accept/i }).check();
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: "networkidle" }),
      this.page.getByRole("button", { name: "Sign In" }).click(),
    ]);
  }

  async navigateToGolfFromSidebar() {
    const page = this.page;
    const categoryMenu = page.locator("span.menu-title.fs-2", { hasText: "Category" });
    if (await categoryMenu.isVisible()) {
      await categoryMenu.click();
    }
    const golfTab = page.locator("span.menu-title.fs-2", { hasText: "Golf" });
    await golfTab.scrollIntoViewIfNeeded();
    await golfTab.click();
  }

  async fillGolfDetails(data) {
    const page = this.page;
    await page.locator('input[name="name"]').fill(data.name);
    await page.locator('select[name="type"]').selectOption(data.type);
    await page.locator('select[name="golfType"]').selectOption(data.golfType);
    await page.getByPlaceholder("Latitude").fill(String(data.latitude));
    await page.getByPlaceholder("Longitude").fill(String(data.longitude));
    await this.selectReactDropdownSequential(page.locator("#react-select-2-input"), data.timezone);
    await page.locator('input[name="addressName"]').fill(data.addressName || "Default Address Name");
    await page.locator('input[name="street"]').fill(data.street || "Default Street");
    await this.selectReactDropdownSequential(page.locator("#react-select-3-input"), data.country);
    await this.selectReactDropdownSequential(page.locator("#react-select-4-input"), data.state);
    await this.selectReactDropdownSequential(page.locator("#react-select-5-input"), data.city);
    if (data.zip) await page.getByPlaceholder("Zip").fill(String(data.zip));
    await this.fillDescriptionFields();
    await page.getByPlaceholder("Booking URL").fill(data.bookingUrl);
    const phoneInput = page.getByPlaceholder("1 (702) 123-");
    await phoneInput.fill("");
    await phoneInput.type(String(data.phone), { delay: 50 });
    await page.getByPlaceholder("Minimum Threshold Amount").fill(String(data.minThreshold));
    await page.getByPlaceholder("Auto - Approved Amount (per").fill(String(data.autoApprovedAmount));
    await page.getByPlaceholder("Please enter the person count").fill(String(data.personCount));
    await page.getByPlaceholder("Please enter the maximum price").fill(String(data.maxPrice));
    await this.selectSqueezInterval(String(data.squeezInterval));
  }

  async fillDescriptionFields() {
    const page = this.page;
    const descriptions = [
      "⛳ This golf course features lush fairways.",
      "🌤️ Great spot for beginners and casual players.",
      "📅 Open year-round with flexible tee times.",
      "👨‍👩‍👧‍👦 Family-friendly environment and amenities.",
      "🏌️‍♂️ Offers a challenging back 9 layout."
    ];
    for (let i = 0; i < descriptions.length; i++) {
      const editor = page.locator(".ql-editor").nth(i);
      await editor.click();
      await editor.fill(descriptions[i]);
    }
  }

  async selectReactDropdownSequential(inputLocator, optionText) {
    const page = this.page;
    const wrapper = inputLocator.locator('xpath=ancestor::div[contains(@class, "css-15noair-control")]');
    await wrapper.click({ force: true });
    await inputLocator.fill(optionText);
    const optionLocator = page.locator('div[id*="-option-"]', { hasText: optionText }).first();
    await optionLocator.waitFor({ state: "visible", timeout: 5000 });
    await optionLocator.scrollIntoViewIfNeeded();
    await optionLocator.click({ force: true });
  }

  async selectSqueezInterval(optionText) {
    const page = this.page;
    const labelLocator = page.getByText("Squeez interval (minutes)", { exact: false });
    const parent = await labelLocator.locator("xpath=..");
    const trigger = parent.locator('.css-15noair-control');
    await trigger.click({ force: true });
    const input = page.locator('input[id^="react-select"][id$="-input"]').last();
    await input.fill(optionText);
    const optionLocator = page.locator('div[id*="-option-"]', { hasText: optionText }).first();
    await optionLocator.waitFor({ state: "visible", timeout: 5000 });
    await optionLocator.click({ force: true });
  }

  async submit() {
    const page = this.page;
    const submitBtn = page.locator("button.btn.btn-primary", { hasText: "Submit" });
    await page.waitForSelector('button:has-text("Submit")', { state: "visible", timeout: 5000 });
    const isDisabled = await submitBtn.getAttribute("disabled");
    if (isDisabled !== null) throw new Error("🚫 Submit button is disabled");
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click({ force: true });
    console.log("✅ Submit button clicked");
  }
}

module.exports = { GolfPage };
