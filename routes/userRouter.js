import express from 'express';
import { addUserSport, createPost, deletePost, deleteUserSport, getPostLikes, joinGame, leaveGame, makePayment, recentActivity, toggleLike, updateUserDetails, userPosts, userProfile } from '../controllers/userController.js';
import { handleValidationErrors } from '../middleware/validation.js';
import upload from '../middleware/multer.js';
import { verifyToken } from '../middleware/authUser.js';
import { venueBooking, createPaymentOrder, allCreatedGames, userJoinedGames, userGamesCreated } from '../controllers/bookingController.js';

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

userRouter.delete('/deletePost/:postId/:userId', verifyToken, (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Delete a post by ID'
    // Implementation of deletePost function is assumed to be present
    deletePost(req, res);
});

userRouter.post('/toggle/:postId/:userId', verifyToken, (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Toggle a post by ID'
    toggleLike(req, res);
});

userRouter.get('/getPostLikes/:postId', verifyToken, (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Get likes for a post by ID'
    // Implementation of getPostLikes function is assumed to be present
    getPostLikes(req, res);
});

userRouter.get('/recentActivities/:userId', verifyToken, (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Get recent activities for a user by ID'
    // Implementation of recentActivities function is assumed to be present
    recentActivity(req, res);
});

userRouter.post('/venueBooking', verifyToken, (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Book a venue slot'
    venueBooking(req, res);
});

userRouter.post('/payments/order', verifyToken, (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Create a Razorpay order'
    createPaymentOrder(req, res);
});

userRouter.post('/payments/complete/:gameId', verifyToken, (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Complete payment for a booking'
    makePayment(req, res);
});

userRouter.get('/allGames', verifyToken, (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Get all games for a user by ID'
    allCreatedGames(req, res);
});

userRouter.get('/joinedGames', verifyToken, (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Get all joined games for a user by ID'
    userJoinedGames(req, res);
});

userRouter.get('/usersCreatedGames', verifyToken, (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Get all games created by a user by ID'
    userGamesCreated(req, res);
});

userRouter.post('/joinGame/:userId/:gameId', verifyToken, (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Join a game by ID'
    // Implementation of joinGame function is assumed to be present
    joinGame(req, res);
});

userRouter.delete('/leaveGame/:userId/:gameId', verifyToken, (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Leave a game by ID'
    // Implementation of leaveGame function is assumed to be present
    leaveGame(req, res);
});


export default userRouter;