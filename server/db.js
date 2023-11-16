const mysql = require('mysql2/promise')
const config = {
    database1: {
      host: 'localhost',
      user: 'root',
      password: 'Venus!2#',
      database: 'vasudb',
    },
    database2: {
      host: 'localhost',
      user: 'root',
      password: 'Venus!2#',
      database: 'heavydb',
    },
  };
  function createDatabasePool(company = 'Roofing') {
    console.log(`${company}`)
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