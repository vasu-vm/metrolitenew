
const express = require('express');
const router = express.Router();

const metstockdetailservice = require('../services/metstockdetails.service')
const tokenverification = require('./tokenverification.controller')

// http://localhost:3002/api/metbrands/ -- to access this get method
// array restructuring [rows] instaed of rows to send first element
router.get('/' ,  async function(req, res) {
    tokenverification.verify(req, res)
    if(res.statusCode > 400)
        return;
    
    const metbrands = await metstockdetailservice.getstockdetails(req);
    res.send(metbrands);
})

router.get('/:brandid' ,  async function(req, res) {
    tokenverification.verify(req, res)
    if(res.statusCode > 400)
        return;
    // console.log(req.params.brandid)
    const metbrand = await metstockdetailservice.getstockdetailsusingid(req);
    if(metbrand.length == 0)
        res.status(404).json('no brand with given id :' + req.params.brandid)
    else
        res.send(metbrand);
    
})

router.delete('/:brandid' ,  async function(req, res) {
    tokenverification.verify(req, res)
    if(res.statusCode > 400)
        return;
    console.log("Delete called")
    console.log(req.params.brandid)
    const numrecords = await metstockdetailservice.deletestockdetailsusingid(req);
    if(numrecords == 0)
        res.status(404).json('no brand with given id :' + req.params.brandid)
    else
       res.send('deleted succesfully')
})
//insert new brand
router.post('/' ,  async function(req, res) {
    tokenverification.verify(req, res)
    if(res.statusCode > 400)
        return;
    console.log("Inside Post");
    // console.log(req.params.brandid)
    // console.log(req.body);
    const numrecords = await metstockdetailservice.addorupdatestockdetails(req);
    res.status(201).send('brand created successfully')
    
})
//update existing brand
router.put('/' ,  async function(req, res) {
    tokenverification.verify(req, res)
    if(res.statusCode > 400)
        return;
    // console.log(req.params.brandid)
    // console.log("PUT called")
    const type = 3;
    const affectedRows = await metstockdetailservice.addorupdatestockdetails(req, type);
    if(affectedRows == 0)
        res.status(404).json('no brand with given id :' + req.body.brandid)
    else
       res.send('updated succesfully')
    
})

module.exports = router;