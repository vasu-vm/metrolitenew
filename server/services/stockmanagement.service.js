const db1 = require('../db');

module.exports.deletecoilpurchase = async function(company){
    const db = db1(company)
    const results = await db.query("delete from metcoilpurchasedetails")
    // return data[0][0].affectedRows;
    return results;

}
module.exports.deletecoildaystat = async function(company){
    const db = db1(company)
    const results = await db.query("delete from metcoildaystat")
    // return data[0][0].affectedRows;
    return results;

}


module.exports.insertstockpurchase = async function(obj , company){
    // console.log("Inside insertstockpurchase service")
    // console.log(obj)
    const db = db1(company)
    var excelDateValue = obj['ArrivalDate(yyyy-mm-dd)']; // Replace with your Excel date value
    var javascriptDate = new Date((excelDateValue - 25569) * 86400 * 1000);
    var datestring = javascriptDate.getFullYear()+"-"+(javascriptDate.getMonth() +1) +"-"+javascriptDate.getDate();
    var gfstatus = String(obj['GFStatus']).trim();
    if(gfstatus == "undefined")
        gfstatus = 'N'
    var compstatus = String(obj['CompletionStatus']).trim();
    if(compstatus == "undefined")
       compstatus = 'N'
    var brand = obj['Brand'].trim();
    if(brand.includes("ragati") || brand.includes("p+") )
        brand = "P+"
    const [data] = await db.query("call coil_purchase_create(?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?) " ,
            [obj['Coil ID'], brand, obj['Supplier ID'],obj['Thickness'] ,
            obj['Colour'], obj['Weight'], obj['Location'],obj['AZValue'],
            obj['ZincValue'], gfstatus, datestring,compstatus,obj['Remarks'] ]);
     return data[0][0].affectedRows;

}
module.exports.insertcoildaystat = async function(obj, company){
    // console.log("Inside insertcoildaystat service")
    // console.log(obj)
    const db = db1(company)
    var excelDateValue = obj['StockDate(DD-MM-YYYY)']; // Replace with your Excel date value
    var javascriptDate = new Date((excelDateValue - 25569) * 86400 * 1000);
    var datestring = javascriptDate.getFullYear()+"-"+(javascriptDate.getMonth() +1) +"-"+javascriptDate.getDate();
   //  console.log(type)
    const [data] = await db.query("call coil_daystat_create( ?, ?, ?, ?, ?) " ,
     [obj['CoilID'], obj['OpenCM'], datestring, obj['Location'], obj['Status']])
    return data[0][0].affectedRows;

}