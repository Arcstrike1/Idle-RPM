import "dotenv/config";
import path from 'path'
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from "url";
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json()); 
app.use(express.static('public'));
app.use("/Game", express.static(path.join(__dirname, "Game")));
app.use(cors({
    origin: 'http://8.228.76.117:3000', 
    credentials: true
}));
import { promisePool } from "./Game/db/index.js";
import { getUserByUserId, getUserByUsername } from "./Game/queries/dbQueries.js";
import session from "express-session";
import expressMySQLSession from 'express-mysql-session';
const MySQLStore = expressMySQLSession(session);

export const sessionStore = new MySQLStore({},promisePool);

app.use(session({
  secret: process.env.SESSION_SECRET,
  store: sessionStore, 
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 24*60*60*1000, sameSite: 'lax' }
}));

import userRoutes from './Game/routes/user.js'
app.use('/users', userRoutes);

const chatMessages = [];
const waitingChatClients = new Map();

function addWaitingClient(userId, entry) {
  const list = waitingChatClients.get(userId) || [];
  list.push(entry);
  waitingChatClients.set(userId, list);
}

function flushWaitingClients(userId, messages) {
  const list = waitingChatClients.get(userId);
  if (!list || !list.length) return;
  waitingChatClients.delete(userId);
  for (const { res, timeout } of list) {
    clearTimeout(timeout);
    if (!res.writableEnded) res.json({ messages });
  }
}

function collectUserMessages(userId, since = 0) {
  return chatMessages.filter(m => (m.fromUserId === userId || m.toUserId === userId) && m.id > since);
}

app.post('/chat/send', async (req, res) => {
  const senderId = req.session?.userId;
  if (!senderId) return res.status(401).json({ error: 'Unauthorized' });

  const { recipientId, friendName, text } = req.body;
  if (!text || (!recipientId && !friendName)) {
    return res.status(400).json({ error: 'Message text and recipient are required' });
  }

  let recipient = null;
  if (recipientId) recipient = await getUserByUserId(recipientId);
  else recipient = await getUserByUsername(friendName);

  if (!recipient) return res.status(404).json({ error: 'Recipient not found' });
  if (recipient.id === senderId) return res.status(400).json({ error: 'Cannot send a message to yourself' });

  const sender = await getUserByUserId(senderId);
  if (!sender) return res.status(401).json({ error: 'Sender not found' });

  const message = {
    id: Date.now(),
    fromUserId: sender.id,
    fromUsername: sender.username,
    toUserId: recipient.id,
    toUsername: recipient.username,
    text: String(text),
    createdAt: new Date().toISOString()
  };

  chatMessages.push(message);
  flushWaitingClients(recipient.id, [message]);
  flushWaitingClients(sender.id, [message]);

  return res.json({ ok: true, message });
});

app.get('/chat/conversation', (req, res) => {
  const userId = req.session?.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const peerId = Number(req.query.peerId);
  if (!peerId) return res.status(400).json({ error: 'peerId is required' });

  const messages = chatMessages.filter(m =>
    (m.fromUserId === userId && m.toUserId === peerId) ||
    (m.fromUserId === peerId && m.toUserId === userId)
  ).sort((a, b) => a.id - b.id);

  res.json({ messages });
});

app.get('/chat/poll', (req, res) => {
  const userId = req.session?.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const since = Number(req.query.since) || 0;
  const messages = collectUserMessages(userId, since);
  if (messages.length) return res.json({ messages });

  const timeout = setTimeout(() => {
    const list = waitingChatClients.get(userId) || [];
    waitingChatClients.set(userId, list.filter(entry => entry.res !== res));
    if (!res.writableEnded) res.json({ messages: [] });
  }, 25000);

  req.on('close', () => {
    clearTimeout(timeout);
    const list = waitingChatClients.get(userId) || [];
    waitingChatClients.set(userId, list.filter(entry => entry.res !== res));
  });

  addWaitingClient(userId, { res, timeout });
});

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'public','login.html'));
});
app.get('/signup',(req,res)=> {
    res.sendFile(path.join(__dirname,'public','signup.html'));
})
app.post("/session/save", (req, res) => {
  if (!req.session) {
    return res.status(500).json({ error: "Session not initialized" });
  }

  req.session.data = req.body.save;
  
  res.json({ ok: true,data:req.session.data });
});
app.get("/session/save",(req,res)=> {
  if(!req.session){
    return res.status(500).json({error: "Session not initialized"});
  }

  res.json({ ok: true,data:req.session.data });
})


app.get('/logout', (req, res) => {
  console.log("logout pressed");
  const data = req.session.data;

  console.log(data);

  console.log("Saving to server");

  fetch(`http://localhost:${PORT}/users/save`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      credentials: 'include',
      body: JSON.stringify({ save: data })
  }).catch(err=>console.warn('server save failed', err));

  req.session.destroy((err) => {
    if (err) {
      console.error('Session destruction error:', err);
      return res.status(500).send('Could not log out.');
    }
    res.clearCookie('connect.sid'); 
    res.redirect('/');
  });
});
app.listen(PORT, () => {
  console.log("Serving Game folder from:", path.join(__dirname, "Game"));
  console.log(`Server listening on port http://localhost:${PORT}/`);
});
