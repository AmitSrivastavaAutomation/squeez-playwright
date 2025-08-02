const { defineConfig } = require("@playwright/test");
require("dotenv").config();

module.exports = defineConfig({
  testDir: "./tests",
  workers: 1,
  globalSetup: require.resolve("./global-setup"),

  // ✅ Add Allure Reporter here
  reporter: [
    ["list"], // Optional: shows progress in console
    ["allure-playwright"], // Required for Allure reports
  ],

  use: {
    headless: false,
    baseURL: process.env.BASE_URL,
    viewport: null,
    storageState: "./auth/state.json",
    ignoreHTTPSErrors: true,
    launchOptions: {
      args: ["--start-maximized"],
      slowMo: 50,
    },
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",
  },

  projects: [
    {
      name: "Chromium",
      use: {
        browserName: "chromium",
        viewport: null,
      },
    },
  ],
});
