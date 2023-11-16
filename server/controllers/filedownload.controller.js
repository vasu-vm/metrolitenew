
const express = require('express');
const router = express.Router();
const path = require('path');
require('dotenv').config();
const tokenverification = require('./tokenverification.controller')

router.get('/:fileName', (req, res) => {
    //console.log("Inside file down load router");
    //console.log(req.params.fileName)
    const fileName = req.params.fileName;
     // Get the current date and time
    const currentDate = new Date();  
    require('dotenv').config();
    const fileloc = process.env.UPLOAD_FILE_PATH;
    let uploadfilename = "";
       
     // Define a function to format the date and time
    function formatDate(date) {
             const year = date.getFullYear();
             const month = (date.getMonth() + 1).toString().padStart(2, '0');
             const day = date.getDate().toString().padStart(2, '0');
             return `${year}-${month}-${day}`;
    }
    if(fileName.includes("summary"))
        uploadfilename = `stock-summary-${formatDate(currentDate)}.xlsx`
    else
        uploadfilename = `stock-details-${formatDate(currentDate)}.xlsx`
    //const filePath = path.join(__dirname, 'uploads', fileName);
    // const filePath = path.join('C:\vasu\nodejs\codeAffectionCRUD','uploads', fileName);
    // const filePath = "C:\\vasu\\nodejs\\codeAffectionCRUD\\uploads\\example.pdf";
    const filePath =`${fileloc}${uploadfilename}`;
    console.log(filePath)
    // res.json("1")
    res.download(filePath);
  });
  
// http://localhost:3002/api/downloads/ -- to access this get method
// array restructuring [rows] instaed of rows to send first element

module.exports = router;