// Use `mysql2` which supports MySQL 8 auth plugins
let mysql = require('mysql2');

let pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'cset155',
  database: process.env.DB_NAME || 'idlerpm',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('DB connection error:', err);
    throw err;
  }
  console.log('DB Connected');
  if (connection) connection.release();
});

module.exports = pool.promise();
