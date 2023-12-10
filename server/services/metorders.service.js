const db1 = require('../db');

module.exports.getallorders = async function(req){
    const db = db1(req.company)
    const [records] = await db.query("select * from metorders")
    //.catch(function(err){
    //     console.log(err)
    //})
    //removed catch since we have added global error handling
    return records;

}
//BrandID specific selection
module.exports.getorderusingid = async function(req){
    const db = db1(req.company)
    const ordernum = req.params.orderid;   
    const [row] = await db.query("select * from metorders where ordernum1 = ? " , [ordernum])
    
    return row;

}

module.exports.deletemetorder = async function(req){
    const db = db1(req.company)
    const ordernum = req.params.ordernum;
       
    const [row] = await db.query("delete from metorders where ordernum1 = ? " , [ordernum])
    return row.affectedRows;

}

module.exports.updatemetorder = async function(req, type = 0){
    const db = db1(req.company)
    const newuser = req.body.users +"/" + req.user
    if(req.body.orderstatus == 2)
    {
    const [data] = await db.query("update metorders set orderstatus = ? , users = ? , completiontime = now() where ordernum1 = ? " ,
     [ req.body.orderstatus, newuser, req.body.ordernum1])
    }
    if(req.body.orderstatus == 3)
    {
    const [data] = await db.query("update metorders set orderstatus = ? , users = ? , deliverytime = now() where ordernum1 = ? " ,
     [ req.body.orderstatus, newuser, req.body.ordernum1])
    }
    //return data[0][0].affectedRows;


}