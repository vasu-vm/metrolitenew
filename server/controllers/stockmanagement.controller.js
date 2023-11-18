const express = require('express');
const XLSX = require('xlsx');
const path = require('path');
const router = express.Router();
const fs = require('fs');
const mysql = require('mysql2/promise');

const stockmanagementservice = require('../services/stockmanagement.service')
const tokenverification = require('./tokenverification.controller')
const mysqlConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Venus!2#',
  database: 'vasudb'
};

const config = {
  database1: {
    host: 'localhost',
    user: 'root',
    password: 'Venus!2#',
    database: 'vasudb'
    
  },
  database2: {
    host: 'localhost',
    user: 'root',
    password: 'Venus!2#',
    database: 'heavydb'
    
  },
};
function getMySqlConfig(company = 'Roofing') {
  console.log(`${company}`)
  const dbConfig = company === 'Roofing' ? config.database1 : config.database2;
  return (dbConfig);
}
// http://localhost:3002/api/metbrands/ -- to access this get method
// array restructuring [rows] instaed of rows to send first element
async function insert(row , company)
{
    const rowcount = await stockmanagementservice.insertstockpurchase(row , company);
    // console.log("Inside insert " , rowcount)
    return   rowcount;  

}
async function insertcoildaystat(row, company)
{
    const rowcount = await stockmanagementservice.insertcoildaystat(row, company);
    // console.log("Inside insert " , rowcount)
    return   rowcount;  

}
async function readAndDeleteExcelFile(filePath) {
  try {
    // Read the Excel file
    const workbook = XLSX.readFile(filePath);

    // Here, you can process the data in the Excel file as needed.
    // For example, you can access a specific sheet and its data:
    const sheetName = workbook.SheetNames[0]; // Get the first sheet name
    const worksheet = workbook.Sheets[sheetName];
    const excelData = XLSX.utils.sheet_to_json(worksheet);

    console.log('Excel Data:', excelData);

    // Delete the Excel file
     fs.unlink(filePath).then;

    console.log('Excel file deleted successfully.');
  } catch (error) {
    console.error('Error:', error);
  }
}


async function insertIntoMySQL(records , company) {
  const connection = await mysql.createConnection(getMySqlConfig(company));

  try {
    //const insertQuery = 'INSERT INTO testing VALUES (10)';
    
    for (const obj of records) {
      // Insert each record into the MySQL table
      var excelDateValue = obj['ArrivalDate(yyyy-mm-dd)']; // Replace with your Excel date value
      var javascriptDate = new Date((excelDateValue - 25569) * 86400 * 1000);
      var datestring = javascriptDate.getFullYear()+"-"+(javascriptDate.getMonth() +1) +"-"+javascriptDate.getDate();
      var gfstatus = String(obj['GFStatus']).trim();
      if(gfstatus == "undefined")
        gfstatus = 'N'
      var compstatus = String(obj['CompletionStatus']).trim();
      if(compstatus == "undefined")
        compstatus = 'N'
      var brand = obj['Brand'].trim();
      if(brand.includes("ragati") || brand.includes("p+") )
         brand = "P+"
      var remarks = String(obj['Remarks']).trim();
      if(remarks == "undefined")
           remarks = "None"
      var colour = String(obj['Colour']).trim();
      if(colour == "undefined")
            colour = ""
      var location = String(obj['Location']).trim();
      if(location == "undefined")
            location = ""
                   
      console.log(obj['Coil ID'], brand, obj['Supplier ID'],obj['Thickness'] ,
      colour, obj['Weight'], location,obj['AZValue'],
      obj['ZincValue'], gfstatus, datestring,compstatus,remarks)
      await connection.execute("call coil_purchase_create(?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?) " ,
      [obj['Coil ID'], brand, obj['Supplier ID'],obj['Thickness'] ,
      colour, obj['Weight'], location,obj['AZValue'],
      obj['ZincValue'], gfstatus, datestring,compstatus,remarks]);
    }

    console.log('Records inserted successfully.');
  } catch (error) {
    console.error('Error inserting records:', error);
  } finally {
    // Close the MySQL connection
    await connection.end();
  }
}

router.get('/' ,  async function(req, res) 
{
    tokenverification.verify(req, res)
    if(res.statusCode > 400)
      return;
    // console.log("Inside get stockmanagement"); 
    try {
    const filePath = path.join(__dirname, '../filepath/roofingcoilpurchase.xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    let result2 = 0;
    let deleterec = await stockmanagementservice.deletecoilpurchase(req.company);
    console.log(deleterec);
    await insertIntoMySQL(data , req.company);
    console.log(data.length)
    fs.unlink(filePath , (error  )=> {
      if(error) {
        console.error(error)
        return

      }
      console.log(`Excel file '${filePath}' deleted successfully.`);
      
    });
    console.log("Final return" , result2)
    res.send("Insert finished with records " + data.length)

  }
  catch (error) {
    console.error('Error:', error);
  }
   
})

router.get('/:type' ,  async function(req, res) {
    tokenverification.verify(req, res)
    if(res.statusCode > 400)
        return;
    console.log("Inside get type stockmanagement"); 
    try {
      const filePath = path.join(__dirname, '../filepath/roofingcoildaystat.xlsx');
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);
      let result2 = 0;
      let deleterec = await stockmanagementservice.deletecoildaystat(req.company);
      // console.log(deleterec);
      data.forEach((row, index) => {
           const result1 = insertcoildaystat(row , req.company).then(returnValue => {
            // console.log('Return value:', returnValue);
            // result1+=returnValue;
          })
          result2 = (result2 + 1);
       
      })
      console.log(data.length)
      fs.unlink(filePath , (error  )=> {
        if(error) {
          console.error(error)
          return
  
        }
        console.log(`Excel file '${filePath}' deleted successfully.`);
        
      });
      console.log("Final return" , result2)
      res.send("Insert finished with records " + data.length)
  
    }
    catch (error) {
      console.error('Error:', error);
    }
       
    
})


module.exports = router;