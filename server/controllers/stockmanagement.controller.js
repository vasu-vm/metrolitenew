const express = require('express');
const XLSX = require('xlsx');
const path = require('path');
const router = express.Router();
const fs = require('fs');
const mysql = require('mysql2/promise');
const { getconnection} = require('../db1')

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

async function insertIntoMySQLPurchase(records , company) {
  const connection = await getconnection(company);

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
                   
      /*console.log(obj['Coil ID'], brand, obj['Supplier ID'],obj['Thickness'] ,
      colour, obj['Weight'], location,obj['AZValue'],
      obj['ZincValue'], gfstatus, datestring,compstatus,remarks) */
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

async function insertIntoMySQLDetails(records , company) {
  const connection = await getconnection(company);

  try {
    //const insertQuery = 'INSERT INTO testing VALUES (10)';
    
    for (const obj of records) {
      var excelDateValue = obj['StockDate(DD-MM-YYYY)']; // Replace with your Excel date value
      var javascriptDate = new Date((excelDateValue - 25569) * 86400 * 1000);
      var datestring = javascriptDate.getFullYear()+"-"+(javascriptDate.getMonth() +1) +"-"+javascriptDate.getDate();
      var opencm = String(obj['OpenCM']).trim();
      if(opencm == "undefined")
            opencm = 0
      var status = String(obj['Status']).trim();
      if(status == "undefined")
            status = "None"
            
      // console.log(obj['CoilID'], opencm, datestring, obj['Location'], status)
      await connection.execute("call coil_daystat_create( ?, ?, ?, ?, ?) " ,
      [obj['CoilID'], opencm, datestring, obj['Location'], status]);
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
    await insertIntoMySQLPurchase(data , req.company);
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
      await insertIntoMySQLDetails(data , req.company);
      // console.log(deleterec);
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