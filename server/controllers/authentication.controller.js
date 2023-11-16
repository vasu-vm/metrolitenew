
const express = require('express')
const authservice = require('../services/authentication.service')
const router = express.Router();



router.post('/login' ,  async function(req, res) {
    await authservice.login(req, res);
    
})
router.post('/register' ,  async function(req, res) {
    await authservice.register(req, res);
    
})
router.post('/logout' ,  async function(req, res) {
    await authservice.logout(req, res);
    
})

module.exports = router;