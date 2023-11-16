const db1 = require('../db');

module.exports.getstocksummary = async function(req){
    const db = db1(req.company)
    const [records] = await db.query("select * from metstocksummary")
    //.catch(function(err){
    //     console.log(err)
    //})
    //removed catch since we have added global error handling
    return records;

}
//BrandID specific selection
module.exports.getsummaryusingall = async function(req)
{   
    db = db1(req.company)
    console.log("Find Stock Details")
    const brand = req.body.brand; 
    const thickness = req.body.thickness;
    const color = req.body.colour;
    const gfstatus = req.body.gfstatus;
    let azvalue = req.body.azvalue;


    const [row] = await db.query("select * from metstocksummary where Brand = ? and Thickness = ? and \
    Colour = ? and GFStatus = ? and AZValue = ?" , [brand,thickness, color,gfstatus,azvalue])
    //.catch(function(err){
    //     console.log(err)
    //})
    //removed catch since we have added global error handling
    return row;

}

//Brand specific selection
module.exports.getsummaryusingbrand = async function(req){
    db = db1(req.company)
    console.log(req.params)
    let q;
    if(req.params.brandid === 'colours')
         q = " SELECT DISTINCT Colour FROM metstocksummary";
    else if (req.params.brandid === 'brands')   
        q =  "SELECT DISTINCT Brand FROM metstocksummary"
    else
        q =  "SELECT DISTINCT Thickness FROM metstocksummary"
        
    const [row] = await db.query(q)
    //.catch(function(err){
    //     console.log(err)
    //})
    //removed catch since we have added global error handling
    
    return row;

}

module.exports.addOrUpdateStockSummary = async function(obj, type = 0){
    console.log("Inside addOrUpdateStockSummary service")
    console.log(obj)
    console.log(type)
    const [data] = await db.query("call metbrands_upd_or_create( ?, ?, ?, ?, ?) " ,
     [type, obj.BrandID, obj.SupplierID, obj.Specification, obj.Remarks])
    return data[0][0].affectedRows;

}