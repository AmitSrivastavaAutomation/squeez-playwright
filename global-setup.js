const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

module.exports = async () => {
  const { BASE_URL, USER_EMAIL, USER_PASSWORD } = process.env;
  if (!BASE_URL || !USER_EMAIL || !USER_PASSWORD) {
    throw new Error('❌ Missing environment variables: BASE_URL, USER_EMAIL, USER_PASSWORD');
  }

  const storagePath = path.resolve(__dirname, 'auth/state.json');
  const screenshotsDir = path.resolve(__dirname, 'auth/_setup_screens');

  // ✅ Azure DevOps sets TF_BUILD; GitHub sets CI
  const isCI = process.env.CI === 'true' || !!process.env.TF_BUILD;

  // Headless by default on CI; overridable locally
  const headless = isCI ? true : String(process.env.HEADLESS || 'false').toLowerCase() === 'true';
  const slowMo = isCI ? 0 : Number(process.env.SLOWMO || 100);

  if (fs.existsSync(storagePath)) fs.unlinkSync(storagePath);
  fs.mkdirSync(path.dirname(storagePath), { recursive: true });
  fs.mkdirSync(screenshotsDir, { recursive: true });

  const browser = await chromium.launch({ headless, slowMo });
  const context = await browser.newContext({ baseURL: BASE_URL });
  const page = await context.newPage();

  try {
    console.log('🌐 Navigating to login page…');
    await page.goto('/auth/login', { waitUntil: 'domcontentloaded', timeout: 60_000 });

    console.log('🔐 Filling login credentials…');
    await page.getByPlaceholder('Email').waitFor({ state: 'visible', timeout: 15_000 });
    await page.getByPlaceholder('Email').fill(USER_EMAIL);
    await page.getByPlaceholder('Password').fill(USER_PASSWORD);

    const checkbox = page.locator('input[type="checkbox"]');
    if (await checkbox.isVisible()) {
      if (!await checkbox.isChecked()) await checkbox.check({ force: true });
    }

    console.log('🚪 Clicking Sign In…');
    await Promise.all([
      page.waitForURL('**/dashboard', { timeout: 30_000 }),
      page.getByRole('button', { name: /sign in/i }).click()
    ]);

    await page.waitForLoadState('networkidle', { timeout: 30_000 });

    await context.storageState({ path: storagePath });
    console.log('✅ Session saved to:', storagePath);
  } catch (err) {
    console.error('❌ Login failed or dashboard not reached:', err.message);
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    try { await page.screenshot({ path: path.join(screenshotsDir, `global-setup-failure-${ts}.png`), fullPage: true }); } catch {}
    throw err;
  } finally {
    await browser.close();
  }
};
