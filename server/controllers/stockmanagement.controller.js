const express = require('express');
const XLSX = require('xlsx');
const path = require('path');
const router = express.Router();
const fs = require('fs');

const stockmanagementservice = require('../services/stockmanagement.service')
const tokenverification = require('./tokenverification.controller')

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
    data.forEach((row, index) => {
         const result1 = insert(row , req.company).then(returnValue => {
          
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