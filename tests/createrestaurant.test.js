const { test, expect } = require('@playwright/test');
const { RestaurantPage } = require('../pages/RestaurantPage');
const { readExcelData } = require('../utils/readExcel');
const path = require('path');
const fs = require('fs');

// Constants
const EXCEL_FILE_PATH = path.resolve('D:/restaurantData.xlsx');
const SHEET_NAME = 'restaurantData';
const INDEX_TRACK_FILE = path.resolve('restaurantDataIndex.json');

// Load Excel Data
const restaurantList = readExcelData(EXCEL_FILE_PATH, SHEET_NAME);
if (!restaurantList.length) throw new Error('❌ Excel file contains no data.');

// Determine Current Row Index
let currentIndex = 0;
if (fs.existsSync(INDEX_TRACK_FILE)) {
  const saved = JSON.parse(fs.readFileSync(INDEX_TRACK_FILE, 'utf8'));
  currentIndex = (saved.index + 1) % restaurantList.length;
}
fs.writeFileSync(INDEX_TRACK_FILE, JSON.stringify({ index: currentIndex }));

const restaurantData = restaurantList[currentIndex];

test('🧪 Create restaurant entry from Excel', async ({ page }) => {
  test.setTimeout(180000); // 3 minutes timeout

  const restaurantPage = new RestaurantPage(page);
  const stepTag = `row-${currentIndex + 1}-${restaurantData.name.replace(/\s+/g, '_')}`;

  console.log(`🔄 Using Excel row #${currentIndex + 1}: ${restaurantData.name}`);

  // Step 1: Login
  await page.goto('https://admin.sqzvip.com/auth/login');
  await restaurantPage.login('legalsqueez@yopmail.com', 'Welcome@1');

  // Step 2: Navigate to Add Restaurant
  await restaurantPage.navigateToRestaurantFromSidebar();

  // Screenshot before form fill
  await page.screenshot({ path: `screenshots/${stepTag}-before-fill.png`, fullPage: true });

  // Step 3: Fill Form
  await restaurantPage.fillRestaurantDetails(restaurantData);

  // Screenshot after fill
  await page.screenshot({ path: `screenshots/${stepTag}-before-submit.png`, fullPage: true });

  // Step 4: Submit Form
  await restaurantPage.submit();

  // Screenshot after submit
  await page.screenshot({ path: `screenshots/${stepTag}-after-submit.png`, fullPage: true });

  // Step 5: Check for success message
  const successLocator = page.locator('.toast-message, .alert-success, [role="alert"]', {
    hasText: /success|created|added|restaurant created/i,
  });

  try {
    await expect(successLocator).toBeVisible({ timeout: 10000 });
    console.log('✅ Success message found.');
  } catch {
    console.warn('⚠️ Success message not found. Checking fallback redirect...');
    const heading = page.locator('h1, .page-heading', { hasText: /Restaurants/i });
    await expect(heading).toBeVisible({ timeout: 5000 });
    console.log('✅ Redirected to restaurant list. Assuming success.');
  }
});
