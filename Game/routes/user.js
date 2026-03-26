import express from "express";
const router = express.Router();
import userController from '../controllers/userController.js'
import ensureAuth from "../middleware/ensureAuth.js";

router.post('/signup', userController.signup);
router.post('/login', userController.login);


router.get('/save', ensureAuth, userController.getSave);
router.post('/save', ensureAuth, userController.saveGame);

router.get('/userName',ensureAuth,userController.getUser);

export default router;