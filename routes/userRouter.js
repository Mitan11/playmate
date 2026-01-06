import express from 'express';
import { addUserSport, deleteUserSport, updateUserDetails, userProfile } from '../controllers/userController.js';
import { handleValidationErrors } from '../middleware/validation.js';
import upload from '../middleware/multer.js';
import { verifyToken } from '../middleware/authUser.js';

const userSportRouter = express.Router();

// update user Details routes
userSportRouter.put('/updateDetails',upload.single('profile_image'), handleValidationErrors, verifyToken, (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Update user details'
    updateUserDetails(req, res);
});

// add user sport
userSportRouter.post('/userSport', verifyToken, (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Add sport to user profile'
    addUserSport(req, res);
});

// delete user sport
userSportRouter.delete('/deleteUserSport/:user_id/:sport_id', verifyToken, (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Remove sport from user profile'
    deleteUserSport(req, res);
});

// user profile
userSportRouter.get('/profile/:userId', verifyToken, (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Get user profile by ID'
    userProfile(req, res);
});

export default userSportRouter;