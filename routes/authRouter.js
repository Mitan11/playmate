import express from 'express';
import { adminLogin, changePassword, checkEmailExists, healthCheck, login, register, resetPassword, sendResetPasswordEmail, } from '../controllers/authController.js';
import { handleValidationErrors, validateUserLogin, validateUserRegistration, validateResetPasswordEmail, validateResetPassword, validateChangePassword } from '../middleware/validation.js';
import upload from '../middleware/multer.js';
import { verifyToken } from '../middleware/authUser.js';

const authRouter = express.Router();

// User registration route
authRouter.post('/register', upload.single('profile_image'), validateUserRegistration, handleValidationErrors, (req, res) => {
    // #swagger.tags = ['Authentication']
    // #swagger.description = 'Register a new user'
    register(req, res);
});

// User login route
authRouter.post('/login', validateUserLogin, handleValidationErrors, (req, res) => {
    // #swagger.tags = ['Authentication']
    // #swagger.description = 'User login'
    login(req, res);
});

// Health check route
authRouter.get('/health', (req, res) => {
    // #swagger.tags = ['Authentication']
    // #swagger.description = 'Health check endpoint'
    healthCheck(req, res);
});

// Check email availability
authRouter.post('/check-email', (req, res) => {
    // #swagger.tags = ['Authentication']
    // #swagger.description = 'Check if email exists'
    checkEmailExists(req, res);
});

// reset password email
authRouter.post('/reset-password-email', validateResetPasswordEmail, handleValidationErrors, (req, res) => {
    // #swagger.tags = ['Authentication']
    // #swagger.description = 'Send password reset email'
    sendResetPasswordEmail(req, res);
});

// reset password route
authRouter.post('/reset-password', validateResetPassword, handleValidationErrors, (req, res) => {
    // #swagger.tags = ['Authentication']
    // #swagger.description = 'Reset user password'
    resetPassword(req, res);
});

// change password route (protected)
authRouter.post('/change-password', verifyToken, validateChangePassword, handleValidationErrors, (req, res) => {
    // #swagger.tags = ['Authentication']
    // #swagger.description = 'Change user password (requires authentication)'
    changePassword(req, res);
});

authRouter.post('/admin-login', (req, res) => {
    // #swagger.tags = ['Authentication']
    // #swagger.description = 'Admin login'
    adminLogin(req, res);
});

export default authRouter;