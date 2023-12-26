const express = require('express');
const XLSX = require('xlsx');
const path = require('path');
const router = express.Router();
const fs = require('fs');
const mysql = require('mysql2/promise');
const { getconnection} = require('../db1')

const stockmanagementservice = require('../services/stockmanagement.service')
const tokenverification = require('./tokenverification.controller')

// http://localhost:3002/api/metbrands/ -- to access this get method
// array restructuring [rows] instaed of rows to send first element

//metdailysales and metstocksummary

async function insertIntoMySQLDaily(records , company) {
  const connection = await getconnection(company);

  try {
    /*
    mysql_update_query = """ update metstocksummary set sqft = sqft - %s \
              where Brand = %s and Thickness = %s and Colour = %s and \
              GFStatus= %s and AZValue = %s"""

        mysql_insert_query = """INSERT INTO metdailysales values (%s,%s,%s,%s,%s,%s,%s,%s)"""
        const insertQuery = `INSERT INTO metdailysales VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [brand, thickness, colour, gfstatus, azvalue, sqft, date, type]


        record = (row[0].strip(), row[1].strip(), row[2].strip(), row[3].strip(),\
                          row[4].strip(), row[5].strip(), row[6].strip(), row[7].strip())
        record_update = (row[5].strip(), row[0].strip(), row[1].strip(), \
                                 row[2].strip(), row[3].strip(), row[4].strip())
        0 - Brand
        1 - Thickness, 2 - Colour, 3 - GF Status, 4 - AZ Values, 5 - Sqft, 
        6 - Date(yyyy/mm/dd), 7 - Type(P=Purchase, S-Sales), 8 - MT, 9 - Lrngth in Meter
                
    */
    
    for (const obj of records) {
      // Insert each record into the MySQL table
      var excelDateValue = obj['Date(yyyy/mm/dd)']; // Replace with your Excel date value
      var javascriptDate = new Date((excelDateValue - 25569) * 86400 * 1000);
      var datestring = javascriptDate.getFullYear()+"-"+(javascriptDate.getMonth() +1) +"-"+javascriptDate.getDate();
      var gfstatus = String(obj['GF Status']).trim();
      if(gfstatus == "undefined")
        gfstatus = 'N'

      var azvalue = String(obj['AZ Value']).trim();
      if(azvalue == "undefined")
        azvalue = '0'

      var thickness = String(obj['Thickness']).trim();
      if(thickness == "undefined")
          thickness = '0'
          
      var brand = String(obj['Brand']).trim();
      if(brand.includes("ragati") || brand.includes("p+") )
         brand = "P+"

      var remarks = String(obj['Remarks']).trim();
      if(remarks == "undefined")
           remarks = "None"

      var colour = String(obj['Colour']).trim();
      if(colour == "undefined")
            colour = ""

      var type = String(obj['Type(P - Purchase, S - Sales)']).trim();
      if(type == "undefined")
            type = ""
      
      var sqft = String(obj['Sqft']).trim();
      if(sqft == "undefined")
            sqft = "0"
      sqft = Math.round(sqft)
      const insertQuery = `INSERT INTO metdailysales VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      const values = [brand, thickness, colour, gfstatus, azvalue, sqft, datestring, type]
      if((type.toUpperCase() == 'P')||( type.toUpperCase() == 'S'))
        await connection.execute(insertQuery,values);
      const mysql_update_query = ` update metstocksummary set sqft = sqft - ? 
      where Brand = ? and Thickness = ? and Colour = ? and 
      GFStatus= ? and AZValue = ?`
      const updatevalues = [sqft,brand,thickness,colour,gfstatus,azvalue]
      if((type.toUpperCase() == 'P')||( type.toUpperCase() == 'S'))
        await connection.execute(mysql_update_query,updatevalues);

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
    const filePath = path.join(__dirname, '../filepath/roofingdaily.xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    let result2 = 0;
    
    await insertIntoMySQLDaily(data , req.company);
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