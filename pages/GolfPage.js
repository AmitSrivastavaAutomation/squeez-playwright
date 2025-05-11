class GolfPage {
  constructor(page) {
    this.page = page;
  }

  // Standard wait between form actions
  async waitStandard() {
    await this.page.waitForTimeout(1000); // uniform delay between actions
  }

  // Login functionality
  async login(email, password) {
    await this.page.getByPlaceholder("Email").fill(email);
    await this.waitStandard();

    await this.page.getByPlaceholder("Password").fill(password);
    await this.waitStandard();

    await this.page
      .getByRole("checkbox", { name: "I Accept theTerms & Conditions" })
      .check();
    await this.waitStandard();

    await Promise.all([
      this.page.waitForNavigation({ waitUntil: "networkidle" }),
      this.page.getByRole("button", { name: "Sign In" }).click(),
    ]);
  }

  // Fill out golf details form
  async fillGolfDetails(data) {
    const page = this.page;

    await page.locator('input[name="name"]').fill(data.name);
    await this.waitStandard();

    await page.locator('select[name="type"]').selectOption(data.type);
    await this.waitStandard();

    await page.locator('select[name="golfType"]').selectOption(data.golfType);
    await this.waitStandard();

    await page.getByPlaceholder("Latitude").fill(String(data.latitude));
    await this.waitStandard();

    await page.getByPlaceholder("Longitude").fill(String(data.longitude));
    await this.waitStandard();

    await page.locator(".css-19bb58m").first().click();
    await page.getByText(data.timezone, { exact: true }).click();
    await this.waitStandard();

    await page.locator('input[name="addressName"]').fill(data.addressName);
    await this.waitStandard();

    await page.getByPlaceholder("Street").fill(data.street);
    await this.waitStandard();

    // Country
    await page.locator(".css-15noair-control").first().click();
    const countryInput = page.locator("#react-select-3-input");
    await countryInput.waitFor({ state: "visible" });
    await countryInput.fill(data.countrySearch);
    await page.getByText(data.country, { exact: true }).click();
    await this.waitStandard();

    // State
    await page
      .locator(".pt-3 > .css-b62m3t-container .css-19bb58m")
      .nth(1)
      .click();
    const stateInput = page.locator("#react-select-4-input");
    await stateInput.fill(data.stateSearch);
    await page.getByText(data.state, { exact: true }).click();
    await this.waitStandard();

    // City
    await page
      .locator(".pt-3 > .css-b62m3t-container .css-19bb58m")
      .nth(2)
      .click();
    const cityInput = page.locator("#react-select-5-input");
    await cityInput.fill(data.citySearch);
    await page.getByText(data.city, { exact: true }).click();
    await this.waitStandard();

    await page.getByPlaceholder("Zip").click();
    await page.getByPlaceholder("Zip").fill(String(data.zip));
    await page.getByPlaceholder("Zip").press("Enter");
    await this.waitStandard();

    await this.fillDescriptionFields();

    await page.getByPlaceholder("Booking URL").click();
    await page.getByPlaceholder("Booking URL").fill(data.bookingUrl);
    await this.waitStandard();

    const phoneInput = page.getByPlaceholder("1 (702) 123-");
    await phoneInput.click();
    await phoneInput.fill("");
    await phoneInput.type(String(data.phone), { delay: 100 });
    await this.waitStandard();

    await page.getByPlaceholder("Minimum Threshold Amount").click();
    await page
      .getByPlaceholder("Minimum Threshold Amount")
      .fill(String(data.minThreshold));
    await this.waitStandard();

    await page.getByPlaceholder("Auto - Approved Amount (per").click();
    await page
      .getByPlaceholder("Auto - Approved Amount (per")
      .fill(String(data.autoApprovedAmount));
    await this.waitStandard();

    await page.getByPlaceholder("Please enter the person count").click();
    await page
      .getByPlaceholder("Please enter the person count")
      .fill(String(data.personCount));
    await this.waitStandard();

    await page.getByPlaceholder("Please enter the maximum price").click();
    await page
      .getByPlaceholder("Please enter the maximum price")
      .fill(String(data.maxPrice));
    await this.waitStandard();

    // Squeez Interval
    await page.locator(".css-19bb58m").nth(3).click();
    const intervalInput = page.locator("#react-select-6-input");
    await intervalInput.waitFor({ state: "visible" });
    await intervalInput.fill(String(data.squeezInterval));
    const intervalOption = page.locator(`div[id^="react-select-6-option"]`, {
      hasText: String(data.squeezInterval),
    });
    await intervalOption.first().waitFor({ state: "visible" });
    await intervalOption.first().click();
    await this.waitStandard();
  }

  // Fill description fields
  async fillDescriptionFields() {
    const page = this.page;

    const descriptions = [
      "⛳ This golf course features lush fairways.",
      "🌤️ Great spot for beginners and casual players.",
      "📅 Open year-round with flexible tee times.",
      "👨‍👩‍👧‍👦 Family-friendly environment and amenities.",
      "🏌️‍♂️ Offers a challenging back 9 layout.",
    ];

    for (let i = 0; i < descriptions.length; i++) {
      const editor = page.locator(".ql-editor").nth(i);
      await editor.click();
      await editor.fill(descriptions[i]);
      await this.waitStandard();
    }
  }

  // Submit the form
  async submit() {
    const page = this.page;

    const submitBtn = page.locator("button.btn.btn-primary", {
      hasText: "Submit",
    });

    await page.waitForSelector('button:has-text("Submit")', {
      state: "visible",
      timeout: 5000,
    });

    const isDisabled = await submitBtn.getAttribute("disabled");
    if (isDisabled !== null) {
      throw new Error("🚫 Submit button is disabled");
    }

    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click({ force: true });

    console.log("✅ Submit button clicked");
  }
}

module.exports = { GolfPage };