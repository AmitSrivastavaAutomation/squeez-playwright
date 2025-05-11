# Test info

- Name: Login and create new golf entry from Excel
- Location: C:\Users\AMIT\squeez-playwright\tests\creategolf.test.js:25:1

# Error details

```
Error: Timed out 15000ms waiting for expect(locator).toBeVisible()

Locator: getByText(/Golf created successfully/i)
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 15000ms
  - waiting for getByText(/Golf created successfully/i)

    at C:\Users\AMIT\squeez-playwright\tests\creategolf.test.js:47:62
```

# Page snapshot

```yaml
- text: Golf SA
- link "Logo":
  - /url: /dashboard
  - img "Logo"
- img
- link "  Dashboard":
  - /url: /dashboard
- link "  Banner":
  - /url: /banner
- link "  Category":
  - /url: /category
- link "  Squeez":
  - /url: /squeez
- link "  WaitList":
  - /url: /waitlist
- link "   Middleware":
  - /url: /middleware
- link "   You're in®":
  - /url: /you-are-in
- text:    App User      Contact Us
- link " User Preference":
  - /url: /userPreference
- link "   FAQ":
  - /url: /faq
- button "  Back"
- text: Holes Type
- combobox:
  - option "Select All" [selected]
  - option "9 Holes"
  - option "18 Holes"
- text: Golf Type
- combobox:
  - option "Select All" [selected]
  - option "Public"
  - option "Private"
  - option "Semi Private"
  - option "Resort"
- text: Search By Name
- textbox "Search"
- text: Search by Status
- combobox:
  - option "All" [selected]
  - option "Active"
  - option "Inactive"
  - option "Intimate"
- button " Add Golf"
- grid:
  - rowgroup:
    - row "Name Golf Type Holes Type Status Actions":
      - columnheader "Name"
      - columnheader "Golf Type"
      - columnheader "Holes Type"
      - columnheader "Status"
      - columnheader "Actions"
  - rowgroup:
    - row "AMIT GOLF STRIPE Public 18 Active More Actions":
      - cell "AMIT GOLF STRIPE"
      - cell "Public"
      - cell "18"
      - cell "Active"
      - cell "More Actions":
        - button "More Actions"
    - row "Alexandra Sparks Stripe SemiPrivate 18 Active More Actions":
      - cell "Alexandra Sparks Stripe"
      - cell "SemiPrivate"
      - cell "18"
      - cell "Active"
      - cell "More Actions":
        - button "More Actions"
    - row "Ameliaka Golf Public 9 Active More Actions":
      - cell "Ameliaka Golf"
      - cell "Public"
      - cell "9"
      - cell "Active"
      - cell "More Actions":
        - button "More Actions"
    - row "Bardmoor GC Public 18 Active More Actions":
      - cell "Bardmoor GC"
      - cell "Public"
      - cell "18"
      - cell "Active"
      - cell "More Actions":
        - button "More Actions"
    - row "Bardmoor GC Feni Public 18 Intimate More Actions":
      - cell "Bardmoor GC Feni"
      - cell "Public"
      - cell "18"
      - cell "Intimate"
      - cell "More Actions":
        - button "More Actions"
    - row "Bloomingdale GC Public 18 Active More Actions":
      - cell "Bloomingdale GC"
      - cell "Public"
      - cell "18"
      - cell "Active"
      - cell "More Actions":
        - button "More Actions"
    - row "Chi Chi Rodriguez Public 18 Active More Actions":
      - cell "Chi Chi Rodriguez"
      - cell "Public"
      - cell "18"
      - cell "Active"
      - cell "More Actions":
        - button "More Actions"
    - row "Fox Hollow GC Public 9 Active More Actions":
      - cell "Fox Hollow GC"
      - cell "Public"
      - cell "9"
      - cell "Active"
      - cell "More Actions":
        - button "More Actions"
    - row "Northdale GC Public 18 Active More Actions":
      - cell "Northdale GC"
      - cell "Public"
      - cell "18"
      - cell "Active"
      - cell "More Actions":
        - button "More Actions"
    - row "Test Golf Course 3 Private 9 Active More Actions":
      - cell "Test Golf Course 3"
      - cell "Private"
      - cell "9"
      - cell "Active"
      - cell "More Actions":
        - button "More Actions"
  - paragraph: "Rows per page:"
  - 'combobox "Rows per page: 10"': "10"
  - paragraph: 1–10 of 10
  - button "Go to previous page" [disabled]
  - button "Go to next page" [disabled]
- heading "Activity Logs" [level=3]
- button " "
- text: "   There are 2 new tasks for you in “AirPlus Mobile APp” project: Added at 4:23 PM by"
- img "img"
- link "Meeting with customer":
  - /url: "#"
- text: Application Design
- img "img"
- img "img"
- text: A In Progress
- link "View":
  - /url: "#"
- link "Project Delivery Preparation":
  - /url: "#"
- text: CRM System Development
- img "img"
- text: B Completed
- link "View":
  - /url: "#"
- text:    Invitation for crafting engaging designs that speak human workshop Sent at 4:23 PM by
- img "img"
- text:     
- link "3 New Incoming Project Files:":
  - /url: "#"
- text: Sent at 10:30 PM by
- img "img"
- link "Finance KPI App Guidelines":
  - /url: "#"
- text: 1.9mb
- link "Client UAT Testing Results":
  - /url: "#"
- text: 18kb
- link "Finance Reports":
  - /url: "#"
- text: 20mb   Task
- link "#45890":
  - /url: "#"
- text: merged with
- link "#45890":
  - /url: "#"
- text: "in “Ads Pro Admin Dashboard project: Initiated at 4:23 PM by"
- img "img"
- text: "  3 new application design concepts added: Created at 4:23 PM by"
- img "img"
- img "img"
- link "Explore":
  - /url: "#"
- img "img"
- link "Explore":
  - /url: "#"
- img "img"
- link "Explore":
  - /url: "#"
- text:   New case
- link "#67890":
  - /url: "#"
- text: is assigned to you in Multi-platform Database Design project Added at 4:23 PM by
- link "Alice Tan":
  - /url: "#"
- text: "  You have received a new order: Placed at 5:05 AM by"
- img "img"
- heading "Database Backup Process Completed!" [level=4]
- text: Login into Metronic Admin Dashboard to make sure the data integrity is OK
- link "Proceed":
  - /url: "#"
- text:     New order
- link "#67890":
  - /url: "#"
- text: is placed for Workshow Planning & Budget Estimation Placed at 4:23 PM by
- link "Jimmy Bold":
  - /url: "#"
- link "View All Activities  ":
  - /url: /crafted/pages/profile
- link "Brian Cox":
  - /url: "#"
- text: Active
- button ""
- text:  
- img "Pic"
- link "Brian Cox":
  - /url: "#"
- text: 2 mins How likely are you to recommend our company to your friends and family ? 5 mins
- link "You":
  - /url: "#"
- img "Pic"
- text: Hey there, we’re just writing to let you know that you’ve been subscribed to a repository on GitHub.
- img "Pic"
- link "Brian Cox":
  - /url: "#"
- text: 1 Hour Ok, Understood! 2 Hours
- link "You":
  - /url: "#"
- img "Pic"
- text: You’ll receive notifications for all issues, pull requests!
- img "Pic"
- link "Brian Cox":
  - /url: "#"
- text: "3 Hours You can unwatch this repository immediately by clicking here:"
- link "Keenthemes.com":
  - /url: https://keenthemes.com
- text: 4 Hours
- link "You":
  - /url: "#"
- img "Pic"
- text: Most purchased Business courses during this sale!
- img "Pic"
- link "Brian Cox":
  - /url: "#"
- text: 5 Hours Company BBQ to celebrate the last quater achievements and goals. Food and drinks provided
- textbox "Type a message"
- button ""
- button ""
- button "Send"
```

# Test source

```ts
   1 | const { test, expect } = require('@playwright/test');
   2 | const { GolfPage } = require('../pages/GolfPage');
   3 | const { readGolfDataFromExcel } = require('../utils/readExcel');
   4 | const path = require('path');
   5 | const fs = require('fs');
   6 |
   7 | // Load Excel data
   8 | const filePath = path.resolve('D:/golfData.xlsx');
   9 | const golfList = readGolfDataFromExcel(filePath, 'golfData');
  10 |
  11 | if (!golfList.length) {
  12 |   throw new Error("❌ Excel file contains no data.");
  13 | }
  14 |
  15 | // Use an index file to rotate through entries
  16 | const indexFile = path.resolve('golfDataIndex.json');
  17 | let currentIndex = 0;
  18 | if (fs.existsSync(indexFile)) {
  19 |   currentIndex = (JSON.parse(fs.readFileSync(indexFile)).index + 1) % golfList.length;
  20 | }
  21 | fs.writeFileSync(indexFile, JSON.stringify({ index: currentIndex }));
  22 |
  23 | const golfData = golfList[currentIndex];
  24 |
  25 | test('Login and create new golf entry from Excel', async ({ page }) => {
  26 |   test.setTimeout(180000);
  27 |   const golfPage = new GolfPage(page);
  28 |
  29 |   await page.goto('https://admin.sqzvip.com/login');
  30 |   await golfPage.login('legalsqueez@yopmail.com', 'Welcome@1');
  31 |   await page.waitForURL('**/dashboard');
  32 |   await page.waitForLoadState('networkidle');
  33 |
  34 |   await expect(page.locator('a:has-text("Category")')).toBeVisible();
  35 |   await page.locator('a:has-text("Category")').click();
  36 |
  37 |   await expect(page.locator('text=Add Golf information')).toBeVisible();
  38 |   await page.locator('text=Add Golf information').click();
  39 |
  40 |   await expect(page.locator('//button[contains(., "Add Golf")]')).toBeVisible();
  41 |   await page.locator('//button[contains(., "Add Golf")]').click();
  42 |
  43 |   await golfPage.fillGolfDetails(golfData);
  44 |   await golfPage.submit();
  45 |
  46 |   await page.screenshot({ path: 'after-submit.png', fullPage: true });
> 47 |   await expect(page.getByText(/Golf created successfully/i)).toBeVisible({ timeout: 15000 });
     |                                                              ^ Error: Timed out 15000ms waiting for expect(locator).toBeVisible()
  48 | });
  49 |
```