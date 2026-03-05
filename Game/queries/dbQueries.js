const bcrypt = require('bcryptjs');

const {promisePool,db} = require('../db/index');

async function getUsers(){
    const [rows] = await promisePool.query('SELECT * FROM users');
    return rows;
}
async function insertUser(username,email,password){
    const saltRounds = 10;
    hashedPassword = await bcrypt.hash(password,saltRounds);
    await promisePool.query('INSERT INTO users (username, email, password_hash) VALUES (?,?,?)',[username,email,hashedPassword]);
}
async function getUserByEmail(email){
  const [rows] = await promisePool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
}
async function getUserByUsername(username){
  const [rows] = await promisePool.query('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0];
}
async function getSaveByUserId(userId, slot='auto'){
  const [rows] = await promisePool.query('SELECT data FROM game_saves WHERE user_id = ? AND slot_name = ? LIMIT 1', [userId, slot]);
  return rows[0] ? rows[0].data : null;
}
async function upsertSave(userId, data, slot='auto'){
  const [result] = await promisePool.query('SELECT id FROM game_saves WHERE user_id = ? AND slot_name = ? LIMIT 1', [userId, slot]);
  if(result.length && result[0].id){
    await promisePool.query('UPDATE game_saves SET data = ? WHERE id = ?', [JSON.stringify(data), result[0].id]);
  } else {
    await promisePool.query('INSERT INTO game_saves (user_id, slot_name, data) VALUES (?,?,?)', [userId, slot, JSON.stringify(data)]);
  }
}

module.exports = { getUsers , insertUser, getUserByEmail, getUserByUsername, getSaveByUserId, upsertSave };