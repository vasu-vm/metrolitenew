const db1 = require('../db');
const thicknessArray = [];
const supplierArray = [];

module.exports.preparestocks = async function(req){
    console.log("Inside Prepare Stock Service")
    const db = db1(req.company)
    const [records] = await db.query("select a.Specification, b.Thickness, b.SqftPerMT from metbrands a , metcoilthicknesstypes b where b.BrandID = a.BrandID order by a.Specification")
    thicknessArray.push(...records)
    //console.log('Thickness Array:' , thicknessArray)
    // Define the criteria you want to search for
    
    const [supplierrecords] = await db.query("select * from metsuppliers")
    supplierArray.push(...supplierrecords);

    const deletedetails = await db.query("delete from metstockdetails")
   
    const deletesummary = await db.query("delete from metstocksummary")
       
    sqlstatement = "select a.CoilID, a.OpenCM, a.Location, b.Brand, b.Thickness, b.Colour, b.Weight,b.AZValue, b.GFStatus, b.SupplierID \
        from metcoildaystat a , metcoilpurchasedetails b where a.CoilID = b.CoilID"
    const [stockdetails] = await db.query(sqlstatement);
    stockdetails.map((row) => {
        let sqft = 1
        let finalsqft = 1
        const targetObject = thicknessArray.find(item => item.Specification === row.Brand && item.Thickness === row.Thickness);
        if (targetObject) {
            sqft = targetObject.SqftPerMT;
            //console.log(`SqftPerMT of the object ${row.Brand} and thickness ${row.Thickness} is: ${sqft}`);
        } else {
            console.log(`Object with brand ${row.Brand} and thickness ${row.Thickness} not found.`);
        }
        if(row.OpenCM)
            finalsqft = (row.OpenCM * 0.15 * sqft)
        else
            finalsqft = (row.Weight * sqft)
        const targetObjectBrand = supplierArray.find(item => item.SupplierID == row.SupplierID)
        let SupplierDtls = "Unknown"
        if(!targetObjectBrand)
        {
            console.log(`details of supplier ${row.SupplierID} missing`)
        }
        else
        {
          SupplierDtls = targetObjectBrand.Address;
        }
        
        let finalWeight = row.OpenCM ? ( row.OpenCM * 0.15) : ( row.Weight)
        let JSONObject = {
          // Create a JSON object based on the retrieved row
          CoilID: row.CoilID,
          Brand: row.Brand,
          Thickness: row.Thickness,
          Colour: row.Colour,
          Weight: row.Weight,
          OpenCM: row.OpenCM,
          FinalWeight: finalWeight,
          Sqft: finalsqft,
          Location: row.Location,
          GFStatus: row.GFStatus,
          AZValue: row.AZValue,
          Supplier: SupplierDtls
          // Add more properties as needed
        };
       // console.log(JSONObject)
        const insertQuery = `INSERT INTO metstockdetails SET ?`;
        // const result =  db.query(insertQuery,JSONObject );
        db.query(insertQuery, JSONObject, (err, results) => {
            if (err) {
              console.error('Error inserting data: ' + err.message);
            } else {
              console.log('Data inserted successfully. Result: ', results);
            }
        })  
        // console.log(result)

      });
      mysql_insert_summary = " insert into metstocksummary select  Brand, \
            Thickness, Colour, GFStatus, AZValue, \
            SUM(Sqft) from metstockdetails group by Brand, \
            Thickness, Colour, GFStatus, AZValue "
      const summaryresult = await db.query(mysql_insert_summary)
      // console.log(summaryresult[0].affectedRows);
      // console.log(stockdetails[1], "--")

    return summaryresult[0].affectedRows;

}
