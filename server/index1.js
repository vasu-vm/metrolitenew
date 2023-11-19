const mysql = require('mysql2/promise');

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'your_host',
  user: 'your_user',
  password: 'your_password',
  database: 'your_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function insertRecords(records) {
  const tableName = 'your_table_name';

  try {
    const connection = await pool.getConnection();

    for (const record of records) {
      const query = 'INSERT INTO ?? SET ?';
      const params = [tableName, record];

      try {
        const [result] = await connection.execute(query, params);
        console.log('Record inserted successfully:', result);
      } catch (insertError) {
        console.error('Error inserting record:', insertError);
      }
    }

    // Release the connection back to the pool
    connection.release();
  } catch (connectionError) {
    console.error('Error getting MySQL connection:', connectionError);
  }
}

// Your array of records
const records = [
  { name: 'John', age: 25 },
  { name: 'Jane', age: 30 },
  // Add more records as needed
];

// Insert records into the MySQL table
insertRecords(records)
  .then(() => {
    console.log('All records inserted successfully');
    // Optionally, close the pool
    pool.end();
  })
  .catch((error) => {
    console.error('Error:', error);
  });
