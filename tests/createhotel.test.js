const { test, expect } = require('@playwright/test');
const { HotelPage } = require('../pages/HotelPage');
const path = require('path');
const fs = require('fs');

// Excel file path and sheet name
const filePath = 'D:\\hotelData.xlsx';
const sheetName = 'hotelData';

// Read data using HotelPage method
const hotelList = HotelPage.readExcel(filePath, sheetName);
if (!hotelList.length) throw new Error("❌ Excel file contains no data.");

// Manage current index for rotating data rows
const indexFile = path.resolve('hotelDataIndex.json');
let currentIndex = 0;
if (fs.existsSync(indexFile)) {
  const saved = JSON.parse(fs.readFileSync(indexFile, 'utf8'));
  currentIndex = (saved.index + 1) % hotelList.length;
}
fs.writeFileSync(indexFile, JSON.stringify({ index: currentIndex }));

// Select hotel data
const hotelData = hotelList[currentIndex];

test('Login and create new hotel entry from Excel', async ({ page }) => {
  test.setTimeout(180000); // 3-minute timeout

  const hotelPage = new HotelPage(page);
  console.log(`🧪 Using Excel row #${currentIndex + 1}: ${hotelData.name}`);

  await hotelPage.login('legalsqueez@yopmail.com', 'Welcome@1');
  await hotelPage.navigateToHotelForm();

  await page.screenshot({ path: `before-fill-hotel-${currentIndex + 1}.png`, fullPage: true });

  // Fill fields manually here as fillHotelDetails was removed
  await hotelPage.clickAndFill(page.locator('input[name="name"]'), hotelData.name);
  await hotelPage.clickAndFill(page.getByPlaceholder("1 (702) 123-"), hotelData.phone);
  await hotelPage.clickAndFill(page.locator(".ql-editor").first(), hotelData.description);
  await hotelPage.clickAndFill(page.getByPlaceholder("Latitude"), String(hotelData.latitude));
  await hotelPage.clickAndFill(page.getByPlaceholder("Longitude"), String(hotelData.longitude));
  await hotelPage.selectTimezone(hotelData.timezoneSearch, hotelData.timezone);
  await hotelPage.clickAndFill(page.locator('input[name="addressName"]'), hotelData.addressName);
  await hotelPage.clickAndFill(page.getByPlaceholder("Street"), hotelData.street);
  await hotelPage.selectDropdown(0, "react-select-3-input", hotelData.countrySearch, hotelData.country);
  await hotelPage.selectDropdown(1, "react-select-4-input", hotelData.stateSearch, hotelData.state);
  await hotelPage.selectDropdown(2, "react-select-5-input", hotelData.citySearch, hotelData.city);
  await hotelPage.clickAndFill(page.getByPlaceholder("Zip"), hotelData.zip);
  await hotelPage.clickAndFill(page.getByPlaceholder("Booking URL"), hotelData.bookingUrl);
  await hotelPage.clickAndFill(page.getByPlaceholder("Price", { exact: true }), String(hotelData.price));
  await hotelPage.clickAndFill(page.getByPlaceholder("Minimum Threshold Amount"), String(hotelData.minThreshold));
  await hotelPage.clickAndFill(page.getByPlaceholder("Auto - Approved Amount (per"), String(hotelData.autoApprovedAmount));
  await hotelPage.clickAndFill(page.getByPlaceholder("Please enter the person count"), String(hotelData.personCount));
  await hotelPage.clickAndFill(page.getByPlaceholder("Please enter the maximum price"), String(hotelData.maxPrice));
  await hotelPage.selectInterval(hotelData.interval);
  await hotelPage.clickAndFill(
    page.locator('.pt-8 > .col-12 > .quill > .ql-container > .ql-editor'),
    hotelData.safetyMessage
  );

  await page.screenshot({ path: `before-submit-hotel-${currentIndex + 1}.png`, fullPage: true });
  await hotelPage.submit();
  await page.screenshot({ path: `after-submit-hotel-${currentIndex + 1}.png`, fullPage: true });

  // Check for success
  const successMessage = page.locator('.toast-message, .alert-success, [role="alert"]', {
    hasText: /success|hotel created|added|created successfully/i,
  });

  try {
    await expect(successMessage).toBeVisible({ timeout: 10000 });
    console.log("✅ Success message found.");
  } catch (err) {
    console.warn("⚠️ No visible success message found. Checking fallback...");

    const heading = page.locator('h1, .page-heading', { hasText: 'Hotels' });
    await expect(heading).toBeVisible({ timeout: 5000 });

    console.log("✅ Redirected to hotel list. Assuming success.");
  }
});
