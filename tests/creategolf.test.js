const { test, expect } = require('@playwright/test');
const { GolfPage } = require('../pages/GolfPage');
const { readGolfDataFromExcel } = require('../utils/readExcel');
const path = require('path');
const fs = require('fs');

// Load Excel data
const filePath = path.resolve('D:/golfData.xlsx');
const golfList = readGolfDataFromExcel(filePath, 'golfData');

if (!golfList.length) {
  throw new Error("❌ Excel file contains no data.");
}

// Use an index file to rotate through entries
const indexFile = path.resolve('golfDataIndex.json');
let currentIndex = 0;
if (fs.existsSync(indexFile)) {
  currentIndex = (JSON.parse(fs.readFileSync(indexFile)).index + 1) % golfList.length;
}
fs.writeFileSync(indexFile, JSON.stringify({ index: currentIndex }));

const golfData = golfList[currentIndex];

test('Login and create new golf entry from Excel', async ({ page }) => {
  test.setTimeout(180000);
  const golfPage = new GolfPage(page);

  await page.goto('https://admin.sqzvip.com/login');
  await golfPage.login('legalsqueez@yopmail.com', 'Welcome@1');
  await page.waitForURL('**/dashboard');
  await page.waitForLoadState('networkidle');

  await expect(page.locator('a:has-text("Category")')).toBeVisible();
  await page.locator('a:has-text("Category")').click();

  await expect(page.locator('text=Add Golf information')).toBeVisible();
  await page.locator('text=Add Golf information').click();

  await expect(page.locator('//button[contains(., "Add Golf")]')).toBeVisible();
  await page.locator('//button[contains(., "Add Golf")]').click();

  await golfPage.fillGolfDetails(golfData);
  await golfPage.submit();

  await page.screenshot({ path: 'after-submit.png', fullPage: true });
  await expect(page.getByText(/success/i)).toBeVisible({ timeout: 15000 });
});
