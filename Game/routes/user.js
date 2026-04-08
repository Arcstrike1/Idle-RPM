import express from "express";
const router = express.Router();
import userController from '../controllers/userController.js'
import ensureAuth from "../middleware/ensureAuth.js";

router.post('/signup', userController.signup);
router.post('/login', userController.login);

router.get("/pendingFriendships",ensureAuth,userController.pendingRequests);
router.get("/acceptedFriendships",ensureAuth,userController.acceptedRequests);

router.post('/acceptFriendship',ensureAuth,userController.acceptFriendRequest);
router.post('/rejectFriendship',ensureAuth,userController.rejectFriendRequest);
router.post('/removeFriendship',ensureAuth,userController.removeFriend);

router.get('/save', ensureAuth, userController.getSave);
router.post('/save', ensureAuth, userController.saveGame);

router.get('/userName',ensureAuth,userController.getUser);
router.post('/addFriend',ensureAuth,userController.addFriend);
export default router;