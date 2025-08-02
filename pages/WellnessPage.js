const xlsx = require("xlsx");

class WellnessPage {
  constructor(page) {
    this.page = page;
  }

  async waitBeforeClick() {
    await this.page.waitForTimeout(1000);
  }

  async clickAndFill(locator, value) {
    if (!value?.toString().trim()) return;
    await locator.scrollIntoViewIfNeeded();
    await locator.waitFor({ state: "visible", timeout: 3000 });
    await this.waitBeforeClick();
    await locator.click({ force: true, delay: 150 });
    await locator.fill(String(value));
  }

  async login(email, password) {
    await this.page.goto("https://admin.sqzvip.com/auth/login");
    await this.clickAndFill(this.page.getByPlaceholder("Email"), email);
    await this.clickAndFill(this.page.getByPlaceholder("Password"), password);
    await this.page.getByRole("checkbox", { name: /I Accept/i }).check();

    await Promise.all([this.page.waitForNavigation({ waitUntil: "networkidle" }), this.page.getByRole("button", { name: /Sign In/i }).click()]);
  }

  async navigateToForm() {
    await this.page.getByText("Category").click();
    await this.waitBeforeClick();
    await this.page.getByRole("link", { name: "Wellness" }).click();
    await this.waitBeforeClick();
    await this.page.getByRole("button", { name: /Add Wellness/i }).click();
  }

  async fillForm(data) {
    const page = this.page;

    await this.clickAndFill(page.locator('input[name="name"]'), data.name);
    await this.clickAndFill(page.getByPlaceholder("1 (702) 123-"), data.phone);
    await this.clickAndFill(page.getByPlaceholder("Booking URL"), data.bookingUrl);
    await this.clickAndFill(page.getByPlaceholder("Latitude"), data.latitude);
    await this.clickAndFill(page.getByPlaceholder("Longitude"), data.longitude);

    const timezone = page.locator(".css-19bb58m").first();
    await timezone.click({ delay: 150 });
    await page.getByText(data.timezone).click();

    await this.clickAndFill(page.getByPlaceholder("Reservation Link"), data.reservationLink);
    await this.clickAndFill(page.locator(".ql-editor"), data.description);
    await this.clickAndFill(page.locator('input[name="addressName"]'), data.addressName);
    await this.clickAndFill(page.getByPlaceholder("Street"), data.street);

    await this.selectDropdown(0, "react-select-3-input", data.countrySearch, data.country);
    await this.selectDropdown(1, "react-select-4-input", data.stateSearch, data.state);
    await this.selectDropdown(2, "react-select-5-input", data.citySearch, data.city);

    await this.clickAndFill(page.getByPlaceholder("Zip"), data.zip);
    await this.clickAndFill(page.getByPlaceholder("Minimum Threshold Amount"), data.minThreshold);
    await this.clickAndFill(page.getByPlaceholder("Auto - Approved Amount (per"), data.autoApprovedAmount);
    await this.clickAndFill(page.getByPlaceholder("Please enter the person count"), data.personCount);
    await this.clickAndFill(page.getByPlaceholder("Please enter the maximum price"), data.maxPrice);

    await this.selectInterval(data.interval);
  }

  async selectDropdown(index, inputId, searchValue, matchText) {
    const dropdown = this.page.locator(".css-15noair-control").nth(index);
    await dropdown.click({ delay: 150 });

    const input = this.page.locator(`#${inputId}`);
    await input.waitFor({ state: "visible", timeout: 3000 });
    await input.fill(searchValue);

    const option = this.page.locator(`div[id^="${inputId.replace("-input", "-option")}"]`, {
      hasText: matchText,
    });
    await this.waitBeforeClick();
    await option.first().click({ delay: 150 });
  }

  async selectInterval(matchText) {
    const page = this.page;

    const label = await page.getByText(/interval/i).locator("xpath=..");
    const dropdown = label.locator(".css-15noair-control");
    await dropdown.scrollIntoViewIfNeeded();
    await this.waitBeforeClick();
    await dropdown.click({ delay: 150 });

    const input = page.locator('input[id^="react-select"][id$="-input"]').last();
    await input.waitFor({ state: "visible", timeout: 3000 });
    await input.fill(String(matchText));
    await page.waitForTimeout(500);

    const option = page.locator('div[id*="-option-"]', {
      hasText: String(matchText),
    });
    if ((await option.count()) === 0) {
      const available = await page.locator('div[id*="-option-"]').allTextContents();
      throw new Error(`❌ Interval "${matchText}" not found. Available options: ${available.join(", ")}`);
    }

    await this.waitBeforeClick();
    await option.first().click({ delay: 150 });
    console.log(`✅ Interval "${matchText}" selected`);
  }

  async submit() {
    const button = this.page.getByText("Submit");
    await this.waitBeforeClick();
    await button.click({ delay: 150 });
  }

  static readExcel(filePath, sheetName) {
    const workbook = xlsx.readFile(filePath);
    const worksheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(worksheet);
  }
}

module.exports = { WellnessPage };
