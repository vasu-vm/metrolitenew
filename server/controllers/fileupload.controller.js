const multer = require("multer");
const express = require('express');
const router = express.Router();
const tokenverification = require('./tokenverification.controller')

const fileStorageEngine = multer.diskStorage({
    destination: (req , file , cb) => {
        cb(null, "./filepath");
    },
    filename: (req, file, cb) => {
        const receivedfilename = file.originalname;
        if(receivedfilename.toLowerCase().includes("roofing") && receivedfilename.toLowerCase().includes("purchase"))
            // cb(null, Date.now() + "---" + file.originalname)
            cb(null, 'roofingcoilpurchase.xlsx')
        else if(receivedfilename.toLowerCase().includes("roofing") && receivedfilename.toLowerCase().includes("coildaystat"))
            cb(null, 'roofingcoildaystat.xlsx')
        else
            cb(null, Date.now() + "---" + file.originalname)

    }
})

const upload = multer( {storage: fileStorageEngine})

router.post('/' , upload.single("xlfile") , async function(req, res) {
    console.log("Inside File Upload");
    tokenverification.verify(req, res)
    if(res.statusCode > 400)
        return;
    
    // console.log("Inside File Upload");
    console.log(req.file);
    // console.log(req.params.brandid)
    // console.log(req.body);
    // const numrecords = await metbrandservice.addOrDeleteBrands(req.body);
    res.status(201).send('File uploaded successfully')
    
})

module.exports = router;