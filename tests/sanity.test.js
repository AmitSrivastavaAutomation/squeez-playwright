// tests/sanity.test.js
const { exec } = require("child_process");

const sanityTests = [
  "tests/createrestaurant.test.js", // ✅ Sanity for Restaurant
];

const regressionTests = [
  "tests/creategolf.test.js", // ✅ Regression for Golf
];

const allFilesToRun = [...sanityTests, ...regressionTests];
const command = `npx playwright test ${allFilesToRun.join(" ")} --headed && npx allure generate --clean && npx allure open`;

exec(command, (err, stdout, stderr) => {
  if (err) {
    console.error(`❌ Error running selected tests: ${err.message}`);
    return;
  }
  if (stderr) {
    console.error(`⚠️ stderr: ${stderr}`);
  }
  console.log(stdout);
});
