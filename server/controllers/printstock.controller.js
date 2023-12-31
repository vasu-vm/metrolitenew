
const express = require('express');
const router = express.Router();

const printstockservice = require('../services/printstock.service')
const tokenverification = require('./tokenverification.controller')

// http://localhost:3002/api/metbrands/ -- to access this get method
// array restructuring [rows] instaed of rows to send first element
router.get('/' ,  async function(req, res) {
    tokenverification.verify(req, res)
    if(res.statusCode > 400)
        return;
    
    const metbrands = await printstockservice.printstocks(req);
    // res.send(metbrands);
    res.json(`${metbrands}`)
})


module.exports = router;