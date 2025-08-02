const path = require("path");
const fs = require("fs");
const { allure } = require("allure-playwright");
const { readExcelData } = require("../utils/readExcel");
const { expect } = require("@playwright/test");

class BasePage {
  constructor(page, timeout = 10000) {
    this.page = page;
    this.timeout = timeout;
  }

  // ─────────────────────────────────────────────
  // 🖱️ Interaction Utilities
  // ─────────────────────────────────────────────
  async click(locator, testInfo = null) {
    try {
      await locator.waitFor({ state: "visible", timeout: this.timeout });
      await locator.scrollIntoViewIfNeeded();
      await locator.click({ timeout: this.timeout });
      await this.page.waitForTimeout(300);
      console.log(`✅ Clicked element`);
    } catch (err) {
      console.warn(`❌ Click failed: ${err.message}`);
      await this.captureScreenshot("click_error", testInfo);
      throw err;
    }
  }

  async fill(locator, value, testInfo = null) {
    try {
      await locator.waitFor({ state: "visible", timeout: this.timeout });
      await locator.scrollIntoViewIfNeeded();
      const stringValue = String(value).trim();
      const inputType = await locator.getAttribute("type");

      if (inputType === "number") {
        await locator.fill(""); // Clear number input
      }

      await locator.fill(stringValue);
      console.log(`✅ Filled input with: ${stringValue}`);
    } catch (err) {
      console.warn(`❌ Fill failed for "${value}": ${err.message}`);
      await this.captureScreenshot("fill_error", testInfo);
      throw err;
    }
  }

  async waitFor(locator, testInfo = null) {
    try {
      await expect(locator).toBeVisible({ timeout: this.timeout });
    } catch (err) {
      console.warn(`❌ Wait failed: ${err.message}`);
      await this.captureScreenshot("wait_error", testInfo);
      throw err;
    }
  }

  // ─────────────────────────────────────────────
  // 📸 Screenshot Utility
  // ─────────────────────────────────────────────
  async captureScreenshot(name = "error", testInfo = null) {
    const timestamp = Date.now();
    const fileName = `${name}_${timestamp}.png`;
    const errorDir = path.resolve(__dirname, "../errors");

    if (!fs.existsSync(errorDir)) {
      fs.mkdirSync(errorDir, { recursive: true });
    }

    const filePath = path.join(errorDir, fileName);
    const buffer = await this.page.screenshot({ path: filePath, fullPage: true });

    if (testInfo?.attach) {
      await testInfo.attach(name, {
        contentType: "image/png",
        body: buffer,
      });
      console.log(`📎 Screenshot attached to Allure via testInfo.`);
    }

    console.log(`📸 Screenshot saved at: ${filePath}`);
    return filePath;
  }

  // ─────────────────────────────────────────────
  // 📊 Excel Data Utility
  // ─────────────────────────────────────────────
  async getRandomExcelRow(fileName, sheetName = "Sheet1") {
    const filePath = path.resolve(__dirname, `../data/${fileName}`);
    let dataRows;

    try {
      dataRows = await readExcelData(filePath, sheetName);
      if (!dataRows?.length) {
        throw new Error(`Excel sheet "${sheetName}" is empty or missing`);
      }
    } catch (error) {
      console.error(`❌ Failed to read Excel: ${filePath}`);
      console.error(`   Error: ${error.message}`);
      throw error;
    }

    const randomIndex = Math.floor(Math.random() * dataRows.length);
    const row = dataRows[randomIndex];

    console.log(`📄 Picked Row ${randomIndex + 1}: ${row?.name || "[Unnamed]"}`);
    return row;
  }
}

module.exports = { BasePage };
