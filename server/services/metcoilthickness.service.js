const db1 = require('../db');

module.exports.getAllthickness = async function(req){
    const db = db1(req.company)
    const [records] = await db.query("select * from metcoilthicknesstypes")
    //.catch(function(err){
    //     console.log(err)
    //})
    //removed catch since we have added global error handling
    return records;

}
//BrandID specific selection
module.exports.getusingthicknessandbrand = async function(req){
    const db = db1(req.company)
    const thickness = req.params.thickness;
    const brandid =req.params.brandid;
    const [row] = await db.query("select * from metcoilthicknesstypes where BrandId = ? and Thickness = ?" , [brandid, thickness])
    
    return row;

}

module.exports.deletethickness = async function(req){
    const db = db1(req.company)
    const thickness = req.params.thickness;
    const brandid =req.params.brandid;
    
    const [row] = await db.query("delete from metcoilthicknesstypes where Thickness = ? and BrandId = ?" , [thickness, brandid])
    return row.affectedRows;

}

module.exports.addOrDeleteThickness = async function(req, type = 0){
    const obj = req.body;
    const [data] = await db.query("call metcoilthickness_upd_or_create( ?, ?, ?, ?, ?) " ,
     [type, obj.brandid, obj.supplierid, obj.specification, obj.remarks])
    return data[0][0].affectedRows;

}