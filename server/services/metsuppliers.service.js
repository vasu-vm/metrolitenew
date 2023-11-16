const db1 = require('../db');

module.exports.getAllmetsuppliers = async function(req){
    const db = db1(req.company)
    const [records] = await db.query("select * from metsuppliers")
   
    return records;

}
//BrandID specific selection
module.exports.getmetsupplierusingid = async function(req){
    const db = db1(req.company)
    const [row] = await db.query("select * from metsuppliers where SupplierID = ?" , [req.params.supplierid])
    
    return row;

}

module.exports.deletemetsupplierusingid = async function(req){
    const db = db1(req.company)
    const [row] = await db.query("delete from metsuppliers where SupplierID = ?" , [req.params.supplierid])
    return row.affectedRows;

}

module.exports.addOrDeleteSupplier = async function(req, type = 0){
    const obj = req.body;
    const db = db1(req.company)
    const [data] = await db.query("call metsupplier_upd_or_create( ?, ?, ?, ?) " ,
     [type,  obj.SupplierID, obj.Address, obj.Remarks])
    return data[0][0].affectedRows;

}