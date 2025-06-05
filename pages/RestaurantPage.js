class RestaurantPage {
  constructor(page) {
    this.page = page;
  }

  async login(email, password) {
    const page = this.page;

    await page.getByRole('textbox', { name: 'Email' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('checkbox', { name: /I Accept/i }).check();

    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle" }),
      page.getByRole("button", { name: /Sign In/i }).click(),
    ]);
  }

  async navigateToRestaurantFromSidebar() {
    const page = this.page;

    await page.locator('.menu-arrow').first().click({ force: true });
    const restaurantTab = page.getByRole('link', { name: 'Restaurants' });
    await restaurantTab.scrollIntoViewIfNeeded();
    await restaurantTab.click({ force: true });

    const addButton = page.getByRole("button", { name: /Add Restaurant/i });
    await addButton.waitFor({ timeout: 3000 });
    await addButton.click({ force: true });
  }

  async fillRestaurantDetails(data) {
    const page = this.page;

    await page.locator('input[name="name"]').fill(data.name);
    await page.getByPlaceholder("1 (702) 123-").fill(data.phone);
    await page.locator('.ql-editor').first().fill(data.description);
    await page.getByPlaceholder("Latitude").fill(String(data.latitude));
    await page.getByPlaceholder("Longitude").fill(String(data.longitude));

    await this.selectReactDropdown(page.locator("#react-select-2-input"), data.timezone);

    await page.locator('input[name="addressName"]').fill(data.addressName);
    await page.getByPlaceholder("Street").fill(data.street);

    await this.selectReactDropdown(page.locator("#react-select-3-input"), data.country);
    await this.selectReactDropdown(page.locator("#react-select-4-input"), data.state);
    await this.selectReactDropdown(page.locator("#react-select-5-input"), data.city);

    await page.getByPlaceholder("Zip").fill(String(data.zip));
    await page.getByPlaceholder("Booking URL").fill(data.bookingUrl);
    await page.getByPlaceholder("Type", { exact: true }).fill(data.type);
    await page.getByPlaceholder("Restaurant Menu URL").fill(data.menuUrl);
    await page.getByPlaceholder("Minimum Threshold Amount").fill(String(data.minThreshold));
    await page.getByPlaceholder("Auto - Approved Amount (per").fill(String(data.autoApprovedAmount));
    await page.getByPlaceholder("Please enter the person count").fill(String(data.personCount));
    await page.getByPlaceholder("Please enter the maximum price").fill(String(data.maxPrice));

    await this.selectReactDropdown(page.locator("#react-select-6-input"), data.interval);

    await page.locator('.pt-8 > .col-12 > .quill > .ql-container > .ql-editor').fill('Test description');
  }

  async selectReactDropdown(inputLocator, optionText) {
    const page = this.page;

    const wrapper = inputLocator.locator('xpath=ancestor::div[contains(@class, "css-15noair-control")]');
    await wrapper.click({ force: true });
    await inputLocator.fill(optionText);
    await page.waitForTimeout(300); // quick pause to render dropdown

    const option = page.locator('div[id*="-option-"]', { hasText: optionText }).first();

    try {
      await option.waitFor({ state: "visible", timeout: 3000 });
      await option.scrollIntoViewIfNeeded();
      await option.click({ force: true });
    } catch (e) {
      throw new Error(`❌ Option "${optionText}" not found in dropdown`);
    }
  }

  async submit() {
    const page = this.page;
    const submitBtn = page.getByText("Submit");

    await page.waitForSelector('button:has-text("Submit")', {
      state: "visible",
      timeout: 3000,
    });

    const isDisabled = await submitBtn.getAttribute("disabled");
    if (isDisabled !== null) {
      throw new Error("🚫 Submit button is disabled");
    }

    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click({ force: true });
    console.log("✅ Submit button clicked");

    const successToast = page.locator(".toast-message, .alert-success, [role='alert']", {
      hasText: /success|created/i,
    });

    try {
      await successToast.waitFor({ timeout: 5000 });
      console.log("✅ Success toast message found");
    } catch {
      console.warn("⚠️ No success message found. Consider fallback validation.");
    }
  }
}

module.exports = { RestaurantPage };
