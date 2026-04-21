import 'dotenv/config';
import mysql from 'mysql2/promise';
import { Connector } from '@google-cloud/cloud-sql-connector';

const connector = new Connector();

const clientOpts = await connector.getOptions({
  instanceConnectionName: process.env.CLOUD_SQL_INSTANCE,
  ipType: 'PUBLIC', 
});

const pool = mysql.createPool({
  ...clientOpts,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

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