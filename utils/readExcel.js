const xlsx = require('xlsx');

function readGolfDataFromExcel(filePath, sheetName) {
  const workbook = xlsx.readFile(filePath);
  const worksheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(worksheet);
}

module.exports = {
  readGolfDataFromExcel,
};
