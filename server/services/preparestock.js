const mysql = require('mysql2/promise');
const { createDatabasePool } = require('../db1');
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
  function createDatabasePool1(company = 'Roofing') {
    // console.log(`${company}`)
    const dbConfig = company === 'Roofing' ? config.database1 : config.database2;
    return mysql.createPool(dbConfig).getConnection()
    // return dbConfig.getConnection();
  }
*/
async function insertRecords(records, company) {
    // console.log("insertRecords")
    const tableName = 'metstockdetails';
  
    try {
      //const connection = await pool.getConnection();
      const connection = await createDatabasePool(company)
  
      for (const row of records) {
        
        const query = `INSERT INTO metstockdetails (CoilID, Brand, Thickness,Colour,
            Weight,OpenCM, FinalWeight, Sqft, Location,GFStatus, AZValue,
            Supplier) values(${row.CoilID}, "${row.Brand}" ,${row.Thickness}, "${row.Colour}",
         ${row.Weight},${row.OpenCM},
         ${row.FinalWeight},${row.Sqft}, "${row.Location}","${row.GFStatus}", ${row.AZValue}, "${row.Supplier}") `;
        // const params = [tableName, record];
        //console.log(query)
  
        try {
          const [result] = await connection.execute(query);
          // console.log('Record inserted successfully:', result);
        } catch (insertError) {
          console.error('Error inserting record:', insertError);
        }
      }
      //
      mysql_insert_summary = " insert into metstocksummary select  Brand, \
      Thickness, Colour, GFStatus, AZValue, \
      SUM(Sqft) from metstockdetails group by Brand, \
      Thickness, Colour, GFStatus, AZValue "
      const [summaryresult] = await connection.execute(mysql_insert_summary)

      // Release the connection back to the pool
      connection.release();
    } catch (connectionError) {
      console.error('Error getting MySQL connection:', connectionError);
    }
  }

async function processAndInsertData(req, res) {
  // Create a MySQL connection pool
  
  let connection;
  const thicknessArray = [];
  const supplierArray = [];

  try {
    // Get a connection from the pool
    connection = await createDatabasePool(req.company);
    const [records] = await connection.execute("select a.Specification, b.Thickness, b.SqftPerMT from metbrands a , metcoilthicknesstypes b where b.BrandID = a.BrandID order by a.Specification")
    thicknessArray.push(...records)
    const [supplierrecords] = await connection.execute("select * from metsuppliers")
    supplierArray.push(...supplierrecords);
    const deletedetails = await connection.execute("delete from metstockdetails")
   
    const deletesummary = await connection.execute("delete from metstocksummary")

    sqlstatement = "select a.CoilID, a.OpenCM, a.Location, b.Brand, b.Thickness, b.Colour, b.Weight,b.AZValue, b.GFStatus, b.SupplierID \
        from metcoildaystat a , metcoilpurchasedetails b where a.CoilID = b.CoilID "
    // Read records from the source table
    const [rows] = await connection.execute(sqlstatement);

    // Process the data (make changes if needed)
    const modifiedData = rows.map((row) => {
      
      // Make changes to the row if needed
      // For example, you can modify the values or add new properties
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
      return {
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
       
      };
    });

    // Insert the modified records into the destination table
    /* await connection.execute('INSERT INTO destination_table (modifiedField, anotherField) VALUES ?',
      [modifiedData.map((row) => [row.modifiedField, row.anotherField])]); */
    
    /*
      // Prepare the array of values for the insert query
    const values = modifiedData.map(row => [row.CoilID, row.Brand,row.Thickness, row.Colour, row.Weight,
        row.OpenCM,row.FinalWeight,row.Sqft,row.Location,row.GFStatus, row.AZValue, row.Supplier]);

    // Build the SQL query with multiple values
    const query = `INSERT INTO metstockdetails (CoilID, Brand,Thickness, Colour, Weight,OpenCM,FinalWeight,Sqft,
        Location,GFStatus,AZValue, Supplier) VALUES (?, ?, ?, ?,?, ?, ?, ?,?, ?, ?, ?)`;
    */
        insertRecords(modifiedData, req.company)
        .then(() => {
          console.log('All records inserted successfully');
          // Optionally, close the pool
          // pool.end();
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      

    

    console.log('Records inserted into destination_table');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release();
    }
  }

  // Close the connection pool
  // pool.end();
}

// Call the function to execute the process
module.exports = processAndInsertData;

