import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  // Navigate to login page
  await page.goto('https://admin.sqzvip.com/auth/login');
  
  // Log in
  await page.fill('role=textbox[name="Email"]', 'legalsqueez@yopmail.com');
  await page.fill('role=textbox[name="Password"]', 'Welcome@1');
  await page.check('role=checkbox[name="I Accept theTerms & Conditions"]');
  await page.click('role=button[name="Sign In"]');
  
  // Navigate to Category and add Restaurant information
  await page.click('role=link[name="  Category"]');
  await page.click('text=Add Restaurants information');
  await page.click('role=button[name=" Add Restaurant"]');
  
  // Fill out restaurant details
  await page.fill('input[name="name"]', 'Demo Restaurant');
  await page.click('role=button[title="United States: +"]');
  
  // Select country code
  await page.fill('placeholder="search"', 'ind');
  await page.click('text="+91"');
  
  // Fill phone number
  await page.fill('placeholder="1 (702) 123-"', '+91 958-746-324');
  
  // Fill other fields
  await page.fill('.ql-editor', 'Hello World');
  await page.fill('placeholder="Latitude"', '1.2');
  await page.fill('placeholder="Longitude"', '1.2');
  
  // Select time zone
  await page.click('.css-19bb58m');
  await page.click('text=America/Denver');
  
  // Fill address details
  await page.fill('input[name="addressName"]', '123');
  await page.fill('placeholder="Street"', 'america');
  
  // Select country and state
  await page.click('.css-b62m3t-container');
  await page.fill('#react-select-3-input', 'ind');
  await page.click('text="India (IN)"');
  await page.click('.css-b62m3t-container');
  await page.click('text="Bihar"');
  
  // Select city
  await page.click('text=City *Select City');
  await page.fill('#react-select-5-input', 'patna');
  await page.click('text=Patna');
  
  // Fill remaining fields
  await page.fill('placeholder="Zip"', '9658744');
  await page.fill('placeholder="Booking URL"', 'https://world.com');
  await page.fill('placeholder="Email"', 'abc@gmail.com');
  await page.fill('placeholder="Type"', 'restaurant');
  await page.fill('placeholder="Tax"', '10');
  await page.fill('placeholder="Convenience Fee"', '10');
  await page.fill('placeholder="Restaurant Menu URL"', 'https://menu.com');
  await page.fill('placeholder="Minimum Threshold Amount"', '12');
  await page.fill('placeholder="Auto - Approved Amount (per"', '72');
  await page.fill('placeholder="Domain URL"', 'abc');
  
  // Submit the form
  await page.click('text=Submit');
  
  // Additional form data
  await page.fill('placeholder="Please enter the person count"', '4');
  await page.fill('placeholder="Please enter the maximum price"', '100');
  await page.click('form');
  await page.click('text=Submit');
  
  // Update phone number and submit
  await page.fill('placeholder="1 (702) 123-"', '+91 958-746-3245');
  await page.click('text=Submit');
  
  // Search by name
  await page.click('div:has-text("Search By Name")');
});
