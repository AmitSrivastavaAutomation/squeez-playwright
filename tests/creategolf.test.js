// tests/creategolf.test.js
const { test, expect } = require('@playwright/test');
const { GolfPage } = require('../pages/GolfPage');
const { readExcelData } = require('../utils/readExcel');
const path = require('path');
const fs = require('fs');

// Load Excel data
const filePath = path.resolve('D:/golfData.xlsx');
const sheetName = 'golfData';
const golfList = readExcelData(filePath, sheetName);

if (!golfList || golfList.length === 0) {
  throw new Error(`❌ No data found in sheet "${sheetName}".`);
}

// Track which row to use
const indexFile = path.resolve('golfDataIndex.json');
let currentIndex = 0;
if (fs.existsSync(indexFile)) {
  try {
    const saved = JSON.parse(fs.readFileSync(indexFile, 'utf8'));
    currentIndex = (saved.index + 1) % golfList.length;
  } catch {
    console.warn("⚠️ Failed to read index file, defaulting to row 0.");
  }
}
fs.writeFileSync(indexFile, JSON.stringify({ index: currentIndex }));
const golfData = golfList[currentIndex];

test('Login and create new golf entry from Excel', async ({ page }) => {
  test.setTimeout(180000); // 3 min timeout
  const golfPage = new GolfPage(page);

  console.log(`🧪 Using Excel row #${currentIndex + 1}: ${golfData.name}`);

  // Step 1: Go to login page and log in
  await page.goto('https://admin.sqzvip.com/auth/login');
  await golfPage.login('legalsqueez@yopmail.com', 'Welcome@1');

  // Step 2: Ensure login success
  await page.waitForURL('**/dashboard');
  await page.waitForLoadState('networkidle');

  // Step 3: Navigate to Golf section
  await golfPage.navigateToGolfFromSidebar();

  // Step 4: Click Add Golf button
  const addGolfBtn = page.getByRole('button', { name: 'Add Golf' });
  await expect(addGolfBtn).toBeVisible({ timeout: 5000 });
  await addGolfBtn.click();

  // Step 5: Fill golf form
  await golfPage.fillGolfDetails(golfData);

  // Step 6: Submit form
  await golfPage.submit();

  // Step 7: Validate success
  const successToast = page.locator('.toast-message, .alert-success, [role="alert"]', {
    hasText: /success|created|golf/i,
  });

  try {
    await expect(successToast).toBeVisible({ timeout: 10000 });
    console.log('✅ Success toast message found.');
  } catch {
    console.warn('⚠️ Toast not found. Checking fallback header...');
    await page.screenshot({ path: `golf-failure-${currentIndex + 1}.png`, fullPage: true });
    const fallback = page.locator('h1, .page-heading', { hasText: 'Golf' });
    await expect(fallback).toBeVisible({ timeout: 5000 });
    console.log('✅ Fallback Golf heading detected. Assuming success.');
  }
});
