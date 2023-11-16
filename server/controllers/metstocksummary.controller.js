const express = require('express');
const router = express.Router();

const metstocksummaryservice = require('../services/metstocksummary.service')
const tokenverification = require('./tokenverification.controller')

// http://localhost:3002/api/metbrands/ -- to access this get method
// array restructuring [rows] instaed of rows to send first element
router.get('/' ,  async function(req, res) {
    tokenverification.verify(req, res)
    if(res.statusCode > 200)
        return;
    
    const metbrands = await metstocksummaryservice.getstocksummary(req);
    res.send(metbrands);
})

router.get('/:brandid' ,  async function(req, res) {
    tokenverification.verify(req, res)
    if(res.statusCode > 200)
        return;
    console.log(req.params.brandid)
    
    
    const metbrand = await metstocksummaryservice.getsummaryusingbrand(req);
    if(metbrand.length == 0)
        res.status(404).json('no brand with given id :' + req.params.brandid)
    else
        res.send(metbrand);
    
})

router.post('/' ,  async function(req, res) {
    tokenverification.verify(req, res)
    if(res.statusCode > 200)
        return;
    console.log(req.params.brandid)
    console.log(req.params.thickness)
    console.log(req.body)
    
    
    const metbrand = await metstocksummaryservice.getsummaryusingall(req);
    if(metbrand.length == 0)
        res.status(404).json('no brand with given id :' + req.params.brandid)
    else
        res.send(metbrand);
    
})


module.exports = router;