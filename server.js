import "dotenv/config";
import path from 'path'
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json()); 
app.use(express.static('public'));
app.use("/Game", express.static(path.join(__dirname, "Game")));
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true
}));
import { promisePool } from "./Game/db/index.js";
import session from "express-session";
import expressMySQLSession from 'express-mysql-session';
const MySQLStore = expressMySQLSession(session);

const sessionStore = new MySQLStore({},promisePool);

app.use(session({
  secret: process.env.SESSION_SECRET,
  store: sessionStore, 
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 24*60*60*1000, sameSite: 'lax' }
}));

import userRoutes from './Game/routes/user.js'
app.use('/users', userRoutes);

const PORT = 3000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'public','login.html'));
});
app.get('/signup',(req,res)=> {
    res.sendFile(path.join(__dirname,'public','signup.html'));
})
app.get('/logout', (req, res) => {
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
