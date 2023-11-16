
// Define the path to your XLSX file
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path')
// const fs = require('fs');
const readline = require('readline');
const myFunctions = require('./metrolitefunctions');


const xlsxFilePath = path.join(__dirname, 'filepath/R-846-STEELCREAFT.xlsx'); // Replace with your actual file path
const csvFilePath = path.join(__dirname, 'filepath/R-846-STEELCREAFT.csv'); // Replace with your actual file path

// Step 1: Convert XLSX to CSV with column headings
const workbook = XLSX.readFile(xlsxFilePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const csvData = XLSX.utils.sheet_to_csv(worksheet);

fs.writeFileSync(csvFilePath, csvData, 'utf-8');

console.log('XLSX converted to CSV with header:', csvFilePath);
// const fs = require('fs');
//const readline = require('readline');

//const csvFilePath = 'path/to/your/output.csv';  // Replace with the path to your CSV file

// Step 2: Read the CSV line by line without processing the first line (column headings)
const rl = readline.createInterface({
  input: fs.createReadStream(csvFilePath),
  crlfDelay: Infinity,
});

let isFirstLine = false;

rl.on('line', (line) => {
  // Skip the first line (column headings)
  if (isFirstLine) {
    isFirstLine = false;
    return;
  }
    const csvArray = line.split(',');
    console.log(csvArray[0]);

});

rl.on('close', () => {
  console.log('CSV File read successfully.');
});
