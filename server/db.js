const mysql = require('mysql2/promise')

require('dotenv').config();
const config = {
    database1: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE_ROOF,
      waitForConnections: true,
      connectionLimit: 100, // Adjust this limit based on your requirements
      queueLimit: 0
    },
    database2: {
      
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE_HEAVY,
      waitForConnections: true,
      connectionLimit: 100, // Adjust this limit based on your requirements
      queueLimit: 0
    },
  };
  function createDatabasePool(company = 'Roofing') {
    // console.log(`${company}`)
    const dbConfig = company === 'Roofing' ? config.database1 : config.database2;
    return mysql.createPool(dbConfig);
  }
  
  module.exports = createDatabasePool;
/*const mysqlPool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Venus!2#',
    database: 'vasudb'
})



module.exports = mysqlPool
*/