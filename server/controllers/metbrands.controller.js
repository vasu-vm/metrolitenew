
const express = require('express');
const router = express.Router();

const metbrandservice = require('../services/metbrands.service')
const tokenverification = require('./tokenverification.controller')

// http://localhost:3002/api/metbrands/ -- to access this get method
// array restructuring [rows] instaed of rows to send first elements

router.get('/' ,  async function(req, res) {
    tokenverification.verify(req, res)
    if(res.statusCode > 400)
        return;
    // tokenverification.checkcompany(req,res)
    console.log(req.company)
    const metbrands = await metbrandservice.getAllmetbrands(req, res );
    res.send(metbrands);
    
    
})

router.get('/:brandid' ,  async function(req, res) {
    // console.log(req.params.brandid)
    tokenverification.verify(req, res)
    if(res.statusCode > 400)
        return;
    const metbrand = await metbrandservice.getmetbrandusingid(req.params.brandid);
    if(metbrand.length == 0)
        res.status(404).json('no brand with given id :' + req.params.brandid)
    else
        res.send(metbrand);
    
})

router.delete('/:brandid' ,  async function(req, res) {
    tokenverification.verify(req, res)
    if(res.statusCode > 400)
        return;
    // console.log("Delete called")
    // console.log(req.params.brandid)
    const numrecords = await metbrandservice.deletemetbrandusingid(req.params.brandid);
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
    // console.log("Inside Post");
    // console.log(req.params.brandid)
    // console.log(req.body);
    const numrecords = await metbrandservice.addOrDeleteBrands(req.body);
    res.status(201).send('brand created successfully')
    
})
//update existing brand
router.put('/' ,  async function(req, res) {
    // console.log(req.params.brandid)
    // console.log("PUT called")
    tokenverification.verify(req, res)
    if(res.statusCode > 400)
        return;
    const type = 1;
    const affectedRows = await metbrandservice.addOrDeleteBrands(req, type);
    if(affectedRows == 0)
        res.status(404).json('no brand with given id :' + req.body.brandid)
    else
       res.send('updated succesfully')
    
})

module.exports = router;