
const express = require('express');
const router = express.Router();

const preparestockservice = require('../services/preparestock.service')
const tokenverification = require('./tokenverification.controller')
const myFunction = require('../services/preparestock');


// http://localhost:3002/api/metbrands/ -- to access this get method
// array restructuring [rows] instaed of rows to send first element
router.get('/' ,  async function(req, res) {
    console.log("Inside Prepare Stock controller")
    tokenverification.verify(req, res)
    if(res.statusCode > 400)
        return;
    await myFunction(req, res)
    //const metbrands = await preparestockservice.preparestocks(req);
    //res.send(metbrands);
    res.json("Success")
})


module.exports = router;