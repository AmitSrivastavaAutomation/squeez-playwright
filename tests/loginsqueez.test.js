import { test, expect } from '@playwright/test';
import LoginPage from '../pages/loginPage'; // ✅ correct
import { credentials } from '../utils/testData';

test('Valid login to Squeez', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.gotoLogin();
  await loginPage.login(credentials.email, credentials.password);
  await expect(page).toHaveURL(/dashboard/); // Adjust if needed
});

