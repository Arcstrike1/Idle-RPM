import mysql  from 'mysql2';

let pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME, 
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

export const promisePool = pool.promise();
export { pool };

