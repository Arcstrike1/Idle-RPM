require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json()); 
app.use(express.static('public'));
app.use('/Game', express.static(__dirname + '/Game'));
app.use(cors({
    origin: 'http://localhost:300', 
    credentials: true
}));
const {promisePool, promise} = require('./Game/db/index');

const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const sessionStore = new MySQLStore({},promisePool);

app.use(session({
  secret: process.env.SESSION_SECRET,
  store: sessionStore, 
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 24*60*60*1000, sameSite: 'lax' }
}));

const userRoutes = require('./Game/routes/user');
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
  console.log(`Server listening on port http://localhost:${PORT}/`);
});
