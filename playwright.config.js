const { defineConfig } = require("@playwright/test");
require("dotenv").config();

const isCI = process.env.CI === 'true' || !!process.env.TF_BUILD;

module.exports = defineConfig({
  testDir: "./tests",
  workers: isCI ? 4 : 4,
  globalSetup: require.resolve("./global-setup"),
  reporter: [
    ["list"],
    ["allure-playwright", { outputFolder: `allure-report-${process.env.JOB_ID || 'default'}` }]
  ],
  use: {
    headless: isCI ? true : false,               // ✅ headless on Azure
    baseURL: process.env.BASE_URL,
    viewport: isCI ? { width: 1280, height: 800 } : null,
    storageState: "./auth/state.json",
    ignoreHTTPSErrors: true,
    launchOptions: {
      args: isCI ? [] : ["--start-maximized"],
      slowMo: isCI ? 0 : 50,
    },
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",
  },
  projects: [{ name: "Chromium", use: { browserName: "chromium" } }],
});
