const db = require('../db/index');

async function getUsers(){
    const [rows] = await db.query('SELECT * FROM users');
    return rows;
}

module.exports = { getUsers };