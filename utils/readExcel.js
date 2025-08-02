// utils/readExcel.js
const xlsx = require("xlsx");

function readExcelData(filePath, sheetName) {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(sheet);
}

module.exports = { readExcelData };
