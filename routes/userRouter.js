import express from 'express';
import { addUserSport, deleteUserSport, updateUserDetails, userProfile } from '../controllers/userController.js';
import { handleValidationErrors } from '../middleware/validation.js';
import upload from '../middleware/multer.js';
import { verifyToken } from '../middleware/authUser.js';

const userSportRouter = express.Router();

// update user Details routes
userSportRouter.put('/updateDetails',upload.single('profile_image'), handleValidationErrors, verifyToken  ,updateUserDetails);

// add user sport
userSportRouter.post('/userSport', verifyToken, addUserSport);

// delete user sport
userSportRouter.delete('/deleteUserSport/:user_id/:sport_id', verifyToken, deleteUserSport);

// user profile
userSportRouter.get('/profile/:userId', verifyToken, userProfile);

export default userSportRouter;