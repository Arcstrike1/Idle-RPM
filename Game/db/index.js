import 'dotenv/config';
import mysql from 'mysql2/promise';

let pool = null;

async function initDB() {
  while (true) {
    try {
      console.log("Trying to connect to MySQL...");

      pool = mysql.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      socketPath: process.env.INSTANCE_UNIX_SOCKET,
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
