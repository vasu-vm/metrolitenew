
const express = require('express');
const router = express.Router();

const metordersservice = require('../services/metorders.service')
const tokenverification = require('./tokenverification.controller')

// http://localhost:3002/api/metorders/ -- to access this get method
// array restructuring [rows] instaed of rows to send first element
router.get('/' ,  async function(req, res) {
    tokenverification.verify(req, res)
    if(res.statusCode > 200)
        return;
    const coilthickness = await metordersservice.getallorders(req);
    res.send(coilthickness);
})

router.get('/:orderid' ,  async function(req, res) {
    // console.log(req.params.brandid)
    const order = await metordersservice.getorderusingid(req);
    if(order.length == 0)
        res.status(404).json('no details matching given thickness and brand :' + req.params.orderid 
    + " " + req.params.orderid )
    else
        res.send(order);
    
})

router.delete('/:thickness/:brandid' ,  async function(req, res) {
    // console.log(req.params.brandid)
    const numrecords = await metordersservice.deletethickness(req);
    if(numrecords == 0)
        res.status(404).json('no thickness details matching details :' + req.params.thickness + " " + req.params.brandid)
    else
       res.send('deleted succesfully')
})
//insert new brand
router.post('/' ,  async function(req, res) {
    tokenverification.verify(req, res)
    if(res.statusCode > 200)
        return;
   
    const numrecords = await metordersservice.updatemetorder(req);
    res.status(201).send('Thickness details created successfully')
    
})
//update existing brand
router.put('/' ,  async function(req, res) {
    tokenverification.verify(req, res)
    if(res.statusCode > 200)
        return;
   
    const type = 1;
    const affectedRows = await metordersservice.updatemetorder(req, type);
    if(affectedRows == 0)
        res.status(404).json('no thickness details matching details :' + req.body.brandid + " "+ req.body.brandid)
    else
       res.send('updated succesfully')
    
})

module.exports = router;