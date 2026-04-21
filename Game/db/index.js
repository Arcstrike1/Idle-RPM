import 'dotenv/config';
import mysql from 'mysql2/promise';


const pool = mysql.createPool({
  host: process.env.DB_HOST,      // "db"
  port: process.env.DB_PORT,      // 3306
  user: process.env.DB_USER,      // idle_user
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;


pool.getConnection()
  .then((connection) => {
    console.log('DB Connected');
    connection.release();
  })
  .catch((err) => {
    console.error('DB connection error:', err);
    throw err;
  });

export const promisePool = pool;
export { pool, connector };