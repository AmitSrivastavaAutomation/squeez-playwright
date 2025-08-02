// global-setup.js
const { chromium } = require("@playwright/test");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

module.exports = async () => {
  const { BASE_URL, USER_EMAIL, USER_PASSWORD } = process.env;
  const storagePath = path.resolve(__dirname, "auth/state.json");

  if (!BASE_URL || !USER_EMAIL || !USER_PASSWORD) {
    throw new Error("❌ Missing environment variables: BASE_URL, USER_EMAIL, USER_PASSWORD");
  }

  // 🧹 Delete old session file if exists
  if (fs.existsSync(storagePath)) fs.unlinkSync(storagePath);

  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("🌐 Navigating to login page...");
  await page.goto(`${BASE_URL}/auth/login`, { waitUntil: "load" });

  console.log("🔐 Filling login credentials...");
  await page.fill('input[placeholder="Email"]', USER_EMAIL);
  await page.fill('input[placeholder="Password"]', USER_PASSWORD);

  const checkbox = page.locator('input[type="checkbox"]');
  if ((await checkbox.isVisible()) && !(await checkbox.isChecked())) {
    await checkbox.check({ force: true });
  }

  console.log("🚪 Clicking Sign In...");
  await page.click('button:has-text("Sign In")');

  console.log("⏳ Waiting for dashboard to load...");
  try {
    await page.waitForURL("**/dashboard", { timeout: 15000 });
    await page.waitForLoadState("networkidle");
  } catch (err) {
    throw new Error(`❌ Login failed or dashboard not reached: ${err.message}`);
  }

  // 💾 Save auth state
  fs.mkdirSync(path.dirname(storagePath), { recursive: true });
  await context.storageState({ path: storagePath });
  console.log("✅ Session saved to:", storagePath);

  await browser.close();
};
