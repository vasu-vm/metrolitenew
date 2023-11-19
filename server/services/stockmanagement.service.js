const mysql = require('mysql2');
const { getconnection } = require('../db1');

// Create a MySQL connection
/*
const connection = mysql.createConnection({
  host: 'localhost',
      user: 'root',
      password: 'Venus!2#',
      database: 'vasudb'
  
});
*/
/*
const config = {
  database1: {
    host: 'localhost',
    user: 'root',
    password: 'Venus!2#',
    database: 'vasudb',
    waitForConnections: true,
    connectionLimit: 100, // Adjust this limit based on your requirements
    queueLimit: 0
  },
  database2: {
    host: 'localhost',
    user: 'root',
    password: 'Venus!2#',
    database: 'heavydb',
    waitForConnections: true,
    connectionLimit: 100, // Adjust this limit based on your requirements
    queueLimit: 0
  },
};
function getconnection(company = 'Roofing') {
  // console.log(`${company}`)
  const dbConfig = company === 'Roofing' ? config.database1 : config.database2;
  return mysql.createConnection(dbConfig)
  // return dbConfig.getConnection();
}
*/
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
    const connection = getconnection(company)
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
    
    //=====================================
    connection.query("call coil_purchase_create(?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?) " ,
            [obj['Coil ID'], brand, obj['Supplier ID'],obj['Thickness'] ,
            obj['Colour'], obj['Weight'], obj['Location'],obj['AZValue'],
            obj['ZincValue'], gfstatus, datestring,compstatus,obj['Remarks'] ], (err, results) => {
      if (err) {
        console.error('Error inserting records:', err);
      } else {
        console.log('Records inserted successfully:', results);
      }
    
      // Close the MySQL connection
      connection.end();
    });
    
    //=====================================
    /*const [data] = await connection.query("call coil_purchase_create(?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?) " ,
            [obj['Coil ID'], brand, obj['Supplier ID'],obj['Thickness'] ,
            obj['Colour'], obj['Weight'], obj['Location'],obj['AZValue'],
            obj['ZincValue'], gfstatus, datestring,compstatus,obj['Remarks'] ]);
    connection.end(); */

     //return data[0][0].affectedRows;
     return 1;

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