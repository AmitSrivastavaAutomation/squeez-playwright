// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'https://admin.sqzvip.com',
    headless: false,
    viewport: { width: 1900, height: 900 },
    video: 'on',
    screenshot: 'only-on-failure',
  },
  retries: 0,
  testDir: './tests',
});
