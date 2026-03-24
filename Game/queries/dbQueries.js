import bcrypt from 'bcryptjs';
import { promisePool } from '../db/index.js';

export async function getUsers() {
  const [rows] = await promisePool.query('SELECT * FROM users');
  return rows;
}

export async function insertUser(username, email, password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  await promisePool.query(
    'INSERT INTO users (username, email, password_hash) VALUES (?,?,?)',
    [username, email, hashedPassword]
  );
}

export async function getUserByEmail(email) {
  const [rows] = await promisePool.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows[0];
}

export async function getUserByUsername(username) {
  const [rows] = await promisePool.query(
    'SELECT * FROM users WHERE username = ?',
    [username]
  );
  return rows[0];
}
export async function getUserByUserId(userId) {
  const [rows] = await promisePool.query(
    'SELECT * FROM users WHERE id = ?',
    [userId]
  );
  return rows[0];
}

export async function getSaveByUserId(userId, slot = 'auto') {
  const [rows] = await promisePool.query(
    'SELECT data FROM game_saves WHERE user_id = ? AND slot_name = ? LIMIT 1',
    [userId, slot]
  );
  return rows[0] ? rows[0].data : null;
}
export async function createFriendship(user1,user2){
  await promisePool.query(
    'INSERT INTO friendships (user_id,friend_id) VALUES (?,?)',[user1,user2]
  );
}
export async function getFriendship(user1, user2) {
  const [rows] = await promisePool.query(
    'SELECT * FROM friendships WHERE user_id = ? AND friend_id = ?',
    [user1, user2]
  );
  return rows[0];
}
export async function upsertSave(userId, data, slot = 'auto') {
  const [result] = await promisePool.query(
    'SELECT id FROM game_saves WHERE user_id = ? AND slot_name = ? LIMIT 1',
    [userId, slot]
  );

  if (result.length && result[0].id) {
    await promisePool.query(
      'UPDATE game_saves SET data = ? WHERE id = ?',
      [JSON.stringify(data), result[0].id]
    );
  } else {
    await promisePool.query(
      'INSERT INTO game_saves (user_id, slot_name, data) VALUES (?,?,?)',
      [userId, slot, JSON.stringify(data)]
    );
  }
}

export default {
  getUsers,
  insertUser,
  getUserByEmail,
  getUserByUsername,
  getSaveByUserId,
  upsertSave,
  getUserByUserId,
  createFriendship,
  getFriendship
};