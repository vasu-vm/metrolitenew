const db1 = require('../db');

module.exports.getstockdetails = async function(req){
    const db = db1(req.company)
    const [records] = await db.query("select * from metstockdetails order by Brand, Thickness, Colour, GFStatus")
    //.catch(function(err){
    //     console.log(err)
    //})
    //removed catch since we have added global error handling
    return records;

}
//BrandID specific selection
module.exports.getstockdetailsusingid = async function(req){
    const db = db1(req.company)
    const [row] = await db.query("select * from metstockdetails where Brand = ?" , [req.params.brandid])
    //.catch(function(err){
    //     console.log(err)
    //})
    //removed catch since we have added global error handling
    return row;

}

module.exports.deletestockdetailsusingid = async function(req){
    const db = db1(req.company)
    const [row] = await db.query("delete from metstockdetails where BrandId = ?" , [req.params.brandid])
    return row.affectedRows;

}

module.exports.addorupdatestockdetails = async function(req, type = 0){
    console.log("Inside addorupdatestockdetails service")
    const obj = req.body;
    console.log(obj)
    console.log(type)
    const [data] = await db.query("call metstockdetails_upd_or_create( ?, ?, ?, ?, ?, \
        ?, ?, ?, ?, ?, ?, ?, ?) " ,
     [type, obj.CoilID, obj.Brand, obj.Thickness, obj.Colour,
       obj.Weight, obj.OpenCM, obj.FinalWeight, obj.Sqft,
       obj.Location, obj.GFStatus, obj.AZValue, obj.Supplier])
    return data[0][0].affectedRows;
    

}