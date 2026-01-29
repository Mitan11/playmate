import express from 'express';
import { addUserSport, createPost, deleteUserSport, updateUserDetails, userPosts, userProfile } from '../controllers/userController.js';
import { handleValidationErrors } from '../middleware/validation.js';
import upload from '../middleware/multer.js';
import { verifyToken } from '../middleware/authUser.js';

const userRouter = express.Router();

// update user Details routes
userRouter.put('/updateDetails', upload.single('profile_image'), handleValidationErrors, verifyToken, (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Update user details'
    updateUserDetails(req, res);
});

// add user sport
userRouter.post('/userSport', verifyToken, (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Add sport to user profile'
    addUserSport(req, res);
});

// delete user sport
userRouter.delete('/deleteUserSport/:user_id/:sport_id', verifyToken, (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Remove sport from user profile'
    deleteUserSport(req, res);
});

// user profile
userRouter.get('/profile/:userId', verifyToken, (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Get user profile by ID'
    userProfile(req, res);
});

userRouter.get('/userPosts/:userId', verifyToken, (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Get user posts by ID'
    userPosts(req, res);
});

userRouter.post('/createPost/:userId', upload.single('media_url'), verifyToken, (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Create a new post'
    createPost(req, res);
});

export default userRouter;