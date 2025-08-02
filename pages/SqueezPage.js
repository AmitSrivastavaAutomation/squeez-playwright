const { expect } = require("@playwright/test");

class SqueezPage {
  constructor(page) {
    this.page = page;
    this.statusDropdown = page.locator("select.form-select.cutom-border").nth(1); // "Search by Status"
    this.tableRows = page.locator('[role="row"][data-rowindex]');
  }

  async navigateToSqueezPage() {
    console.log("👉 Navigating to Squeez tab...");
    const link = this.page.locator('a.menu-link:has-text("Squeez")');

    await Promise.all([this.page.waitForLoadState("networkidle"), link.click()]);

    await this.statusDropdown.waitFor({ state: "visible", timeout: 10000 });
    console.log("✅ Squeez page loaded.");
  }

  async selectStatus(statusLabel) {
    console.log(`🎯 Selecting status: ${statusLabel}`);
    await this.statusDropdown.waitFor({ state: "visible", timeout: 5000 });
    await this.statusDropdown.selectOption({ label: statusLabel });

    // Blur workaround
    await this.page.locator("text=Search by User/ Item Name").click();

    // Wait for any table result OR empty state
    const statusCell = this.page.locator('[data-field="status"] span');

    console.log("⏳ Waiting for first status cell to contain:", statusLabel);
    await expect(statusCell.first()).toContainText(statusLabel, {
      timeout: 15000,
    });

    console.log("✅ First row status confirmed as", statusLabel);
  }

  async validateAllStatuses(expectedStatus) {
    const rows = this.page.locator('[role="row"][data-rowindex]');
    const count = await rows.count();

    if (count === 0) {
      throw new Error("❌ No rows found after filtering.");
    }

    for (let i = 0; i < count; i++) {
      const cell = rows.nth(i).locator('[data-field="status"] span');
      const text = await cell.innerText();
      console.log(`🔍 Row ${i + 1} status: "${text.trim()}"`);
      await expect(text.trim()).toBe(expectedStatus);
    }

    console.log(`✅ All ${count} rows have status "${expectedStatus}"`);
  }
}

module.exports = SqueezPage;
