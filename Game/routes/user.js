const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const ensureAuth = require('../middleware/ensureAuth');

router.post('/signup', userController.signup);
router.post('/login', userController.login);


router.get('/save', ensureAuth, userController.getSave);
router.post('/save', ensureAuth, userController.saveGame);

module.exports = router;