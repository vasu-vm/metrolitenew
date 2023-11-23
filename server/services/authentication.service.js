const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db1 = require('../db');

module.exports.login =  async function(req, res)
{
    console.log(req.body.username);
    console.log(req.body.password);
    const db = db1(req.body.company)
    const querystr = "select * from metusers where username = ?";
    
    const [data] = await db.query(querystr, [req.body.username])
    
    if(data.length == 0)
            return res.status(404).json("User not found!");
    const checkPassword = bcrypt.compareSync(req.body.password, data[0].password);
    if(!checkPassword)
            return res.status(400).json("Wrong user name or pass word!");
    console.log(data[0])    
    const token = jwt.sign({username: data[0].username, company: req.body.company}, "secretkey");
        //const token = jwt.sign({ id: data[0].id }, "secretkey");

        const { password, ...others } = data[0];
        console.log("-----------")
        res.cookie("metrolite", token, {httpOnly:false  }).status(200).json(others);
    
}

module.exports.register = async function(req, res)
{
    console.log('Register1')
    const db = db1(req.body.company)
    const q = "select * from metusers where username = ?"
    const [data] = await db.query(q, [req.body.username] )
    //const [row] = await db.query("select * from metbrands where BrandId = ?" , [brandid])
    console.log('Register2')
        
        if(data.length)
            return res.status(409).json("User already exists");

         //IF NOT- Create a new user
         //Encrypt password

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        //insert user
        const q2 = "insert into metusers values (?)"
        const values = [req.body.username,  hashedPassword]
        console.log('Register3')
        const [data1] = await db.query(q2,[values])
        console.log(data1.affectedRows)
        return res.status(200).json("User has been created")
   
}

module.exports.logout = function(req, res)
{
    res.clearCookie("metrolite" ,{secure:true, sameSite:"none"}).status(200).json("User has been logged out");
}