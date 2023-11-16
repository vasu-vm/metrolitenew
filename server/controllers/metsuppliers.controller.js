
const express = require('express');
const router = express.Router();

const metsupplierservice = require('../services/metsuppliers.service')
const tokenverification = require('./tokenverification.controller')

// http://localhost:3002/api/suppliers/ -- to access this get method
// array restructuring [rows] instaed of rows to send first element
router.get('/' ,  async function(req, res) {
    tokenverification.verify(req, res)
    if(res.statusCode > 400)
        return;
    
    const metsuppliers = await metsupplierservice.getAllmetsuppliers(req);
    res.send(metsuppliers);
})

router.get('/:supplierid' ,  async function(req, res) {
    tokenverification.verify(req, res)
    if(res.statusCode > 400)
        return;
    const metsupplier = await metsupplierservice.getmetsupplierusingid(req);
    if(metsupplier.length == 0)
        res.status(404).json('no supplier with given id :' + req.params.supplierid)
    else
        res.send(metsupplier);
    
})

router.delete('/:supplierid' ,  async function(req, res) {
    tokenverification.verify(req, res)
    if(res.statusCode > 400)
        return;
    const numrecords = await metsupplierservice.deletemetsupplierusingid(req);
    if(numrecords == 0)
        res.status(404).json('no supplier with given id :' + req.params.supplierid)
    else
       res.send('deleted succesfully')
})
//insert new brand
router.post('/' ,  async function(req, res) {
    tokenverification.verify(req, res)
    if(res.statusCode > 400)
        return;
    
    const numrecords = await metsupplierservice.addOrDeleteSupplier(req);
    res.status(201).send('brand created successfully')
    
})
//update existing brand
router.put('/' ,  async function(req, res) {
    tokenverification.verify(req, res)
    if(res.statusCode > 400)
        return;
    const type = 1;
    const affectedRows = await metsupplierservice.addOrDeleteSupplier(req, type);
    if(affectedRows == 0)
        res.status(404).json('no supplier with given id :' + req.body.brandid)
    else
       res.send('updated succesfully')
    
})

module.exports = router;