import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://admin.sqzvip.com/auth/login');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('legalsqueez@yopmail.com');
  await page.getByRole('textbox', { name: 'Email' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Password' }).fill('Welcome@1');
  await page.getByRole('checkbox', { name: 'I Accept theTerms & Conditions' }).check();
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByRole('link', { name: '  Category' }).click();
  await page.getByText('Add Restaurants information').click();
  await page.getByRole('button', { name: ' Add Restaurant' }).click();
  await page.locator('input[name="name"]').click();
  await page.locator('input[name="name"]').press('CapsLock');
  await page.locator('input[name="name"]').fill('MAY');
  await page.getByPlaceholder('1 (702) 123-').click();
  await page.getByPlaceholder('1 (702) 123-').fill('+1 852-369-7412');
  await page.locator('p').nth(2).click();
  await page.locator('.ql-editor').first().fill('NEW RESTAURANT');
  await page.getByPlaceholder('Latitude').click();
  await page.getByPlaceholder('Latitude').fill('1.2');
  await page.getByPlaceholder('Longitude').click();
  await page.getByPlaceholder('Longitude').fill('1.3');
  await page.locator('div').filter({ hasText: /^Select Timezone$/ }).nth(2).click();
  await page.getByText('America/Los_Angeles').click();
  await page.locator('div').filter({ hasText: 'Name *Mobile Number *PhoneDescription * NEW RESTAURANTLatitude *Longitude *' }).nth(3).click();
  await page.locator('input[name="addressName"]').click();
  await page.locator('input[name="addressName"]').fill('ONLY NAME');
  await page.getByPlaceholder('Street').click();
  await page.getByPlaceholder('Street').fill('STREET 1');
  await page.locator('.pt-3 > .css-b62m3t-container > .css-15noair-control > .css-hlgwow > .css-19bb58m').first().click();
  await page.locator('#react-select-3-input').fill('UNITE');
  await page.getByText('United States (US)').click();
  await page.locator('.pt-3 > .css-b62m3t-container > .css-15noair-control > .css-hlgwow > .css-19bb58m').first().click();
  await page.locator('#react-select-4-input').fill('FLOR');
  await page.getByText('Florida', { exact: true }).click();
  await page.getByText('City *Select City').click();
  await page.locator('#react-select-5-input').fill('TAMPA');
  await page.getByText('Tampa', { exact: true }).click();
  await page.getByPlaceholder('Zip').click();
  await page.getByPlaceholder('Zip').fill('852369');
  await page.getByPlaceholder('Booking URL').click();
  await page.getByPlaceholder('Booking URL').press('CapsLock');
  await page.getByPlaceholder('Booking URL').fill('https://new.com');
  await page.getByPlaceholder('Type', { exact: true }).click();
  await page.getByPlaceholder('Type', { exact: true }).fill('typee');
  await page.getByPlaceholder('Restaurant Menu URL').click();
  await page.getByPlaceholder('Restaurant Menu URL').fill('https://menu.com');
  await page.getByPlaceholder('Minimum Threshold Amount').click();
  await page.getByPlaceholder('Minimum Threshold Amount').fill('12');
  await page.getByPlaceholder('Auto - Approved Amount (per').click();
  await page.getByPlaceholder('Auto - Approved Amount (per').fill('72');
  await page.getByPlaceholder('Please enter the person count').click();
  await page.getByPlaceholder('Please enter the person count').fill('5');
  await page.getByPlaceholder('Please enter the maximum price').click();
  await page.getByPlaceholder('Please enter the maximum price').fill('500');
  await page.locator('.pt-6 > div > .css-b62m3t-container > .css-15noair-control > .css-hlgwow > .css-19bb58m').click();
  await page.locator('#react-select-6-option-0').click();
  await page.getByText('Submit').click();
});