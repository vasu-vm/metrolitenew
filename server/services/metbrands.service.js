

const db1 = require('../db');



module.exports.getAllmetbrands = async function(req,  res ){
    const db= db1(req.company);
   
    const [records] = await db.query("select * from metbrands")
    
    return records;
    
}
//BrandID specific selection
module.exports.getmetbrandusingid = async function(req){
    const db= db1(req.company);
    const [row] = await db.query("select * from metbrands where BrandId = ?" , [req.params.brandid])
    //.catch(function(err){
    //     console.log(err)
    //})
    //removed catch since we have added global error handling
    return row;

}

module.exports.deletemetbrandusingid = async function(req){
    const db= db1(req.company);
    const [row] = await db.query("delete from metbrands where BrandId = ?" , [req.params.brandid])
    return row.affectedRows;

}

module.exports.addOrDeleteBrands = async function(req, type = 0){
    console.log("Inside addOrDeleteBrands service")
    const obj = req.body;
    console.log(obj)
    console.log(type)
    const db= db1(req.company);
    const [data] = await db.query("call metbrands_upd_or_create( ?, ?, ?, ?, ?) " ,
     [type, obj.BrandID, obj.SupplierID, obj.Specification, obj.Remarks])
    return data[0][0].affectedRows;

}