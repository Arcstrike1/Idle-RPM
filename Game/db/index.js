import 'dotenv/config';
import mysql from 'mysql2/promise';

let pool = null;

async function initDB() {
  while (true) {
    try {
      console.log("Trying to connect to MySQL...");

      pool = mysql.createPool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });

      const conn = await pool.getConnection();
      conn.release();

      console.log("MySQL connected");
      break;

    } catch (err) {
      console.log("MySQL not ready, retrying in 3s...");
      await new Promise(res => setTimeout(res, 3000));
    }
  }
}

await initDB();

export const promisePool = pool;
export default pool;
