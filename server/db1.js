const mysql = require('mysql2/promise');
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
  function createDatabasePool(company = 'Roofing') {
    // console.log(`${company}`)
    const dbConfig = company === 'Roofing' ? config.database1 : config.database2;
    return mysql.createPool(dbConfig).getConnection()
    // return dbConfig.getConnection();
  }
  // Function 2
  function getconnection(company = 'Roofing') {
    // console.log(`${company}`)
    const dbConfig = company === 'Roofing' ? config.database1 : config.database2;
    return mysql.createConnection(dbConfig)
    // return dbConfig.getConnection();
  }
  
  // Export both functions
  module.exports = {
    createDatabasePool,
    getconnection,
  };