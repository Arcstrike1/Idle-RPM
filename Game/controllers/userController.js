const bcrypt = require('bcryptjs');
const queries = require("../queries/dbQueries");


const login = async (req, res) => {
  try {
    const { username, password } = req.body; 
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });

    let user = await queries.getUserByEmail(username);
    if (!user) user = await queries.getUserByUsername(username);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    
    req.session.userId = user.id;
    res.json({ message: 'Logged in' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getSave = async (req, res) => {
  try {
    const userId = req.session && req.session.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const data = await queries.getSaveByUserId(userId);
    return res.json({ save: data });
  } catch (err) {
    console.error('Get save error', err);
    return res.status(500).json({ error: 'Server error fetching save' });
  }
};

const saveGame = async (req, res) => {
  try {
    const userId = req.session && req.session.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const payload = req.body.save || req.body;
    await queries.upsertSave(userId, payload);
    return res.json({ message: 'Save successful' });
  } catch (err) {
    console.error('Save error', err);
    return res.status(500).json({ error: 'Server error saving data' });
  }
};

const signup = async (req, res) =>{
    try {
        let pass1 = req.body.password;
        let pass2 = req.body.password2;
        let username = req.body.username;
        let email = req.body.email;

        const existingUser = await queries.getUserByUsername(username);

        if(existingUser){
          return res.status(400).json({error: 'User already exists'});
        }
        
        if(!username) return res.status(400).json({ error: 'Username is required' });
        if(!email) return res.status(400).json({ error: 'Email is required' });
        if(!pass1) return res.status(400).json({ error: 'Password is required' });
        if(!pass2) return res.status(400).json({ error: 'Password confirmation is required' });
        
        if(pass1 !== pass2){
            return res.status(400).json({ error: 'Passwords do not match' });
        }
        
        await queries.insertUser(username, email, pass1);
        res.status(200).json({ message: 'Account created successfully!' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Server error during signup' });
    }
}

module.exports = {signup , login, getSave, saveGame};