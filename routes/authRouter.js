import express from 'express';
import { changePassword, checkEmailExists, healthCheck, login, register, resetPassword, sendResetPasswordEmail, } from '../controllers/authController.js';
import { handleValidationErrors, validateUserLogin, validateUserRegistration, validateResetPasswordEmail, validateResetPassword, validateChangePassword } from '../middleware/validation.js';
import upload from '../middleware/multer.js';
import { verifyToken } from '../middleware/authUser.js';

const authRouter = express.Router();

// User registration route
authRouter.post('/register', upload.single('profile_image'), validateUserRegistration, handleValidationErrors, register);

// User login route
authRouter.post('/login', validateUserLogin, handleValidationErrors, login);

// Health check route
authRouter.get('/health', healthCheck);

// Check email availability
authRouter.post('/check-email', checkEmailExists);

// reset password email
authRouter.post('/reset-password-email', validateResetPasswordEmail, handleValidationErrors, sendResetPasswordEmail);

// reset password route
authRouter.post('/reset-password', validateResetPassword, handleValidationErrors, resetPassword);

// change password route (protected)
authRouter.post('/change-password', verifyToken, validateChangePassword, handleValidationErrors, changePassword);

export default authRouter;