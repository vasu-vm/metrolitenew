
const express = require('express');
const path = require('path');
const multer = require("multer");

const router = express.Router();
const tokenverification = require('./tokenverification.controller')

const orderverification = require('../orderverification/readorderfile')
require('dotenv').config();
//const orderverification = require('../orderverification/readorderfile')

const fileStorageEngine = multer.diskStorage({
  destination: (req , file , cb) => {
      cb(null, "./orderverification/filepath");
  },
  filename: (req, file, cb) => {
      const receivedfilename = file.originalname;
      cb(null, file.originalname);
      /*
      if(receivedfilename.toLowerCase().includes("roofing") && receivedfilename.toLowerCase().includes("purchase"))
          // cb(null, Date.now() + "---" + file.originalname)
          cb(null, 'roofingcoilpurchase.xlsx')
      else if(receivedfilename.toLowerCase().includes("roofing") && receivedfilename.toLowerCase().includes("coildaystat"))
          cb(null, 'roofingcoildaystat.xlsx')
      else
          cb(null, Date.now() + "---" + file.originalname)
      */

  }
})


const upload = multer( {storage: fileStorageEngine})

router.post('/' , upload.single("xlfile") , async function(req, res) {
    //console.log("Inside File Upload");
    tokenverification.verify(req, res)
    if(res.statusCode > 400)
        return;
    
    // console.log("Inside File Upload");
    // console.log(req.file);
    // console.log(req.params.brandid)
    // console.log(req.body);
    // const numrecords = await metbrandservice.addOrDeleteBrands(req.body);
    res.status(201).send('File uploaded successfully')
    
})


router.get('/:fileName', async (req, res) => {
    //console.log("Inside File Upload");
    tokenverification.verify(req, res)
    if(res.statusCode > 400)
      return;
 
    const fileName = req.params.fileName;
    //console.log(fileName)
    
    const errortext = await orderverification.verifyorder(req, res,fileName)
    // console.log(errortext, "=====")
    // res.status(201).send(`Result is ${errortext}`)
    
  });
  
// http://localhost:3002/api/downloads/ -- to access this get method
// array restructuring [rows] instaed of rows to send first element

module.exports = router;