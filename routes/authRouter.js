import express from 'express';
import { checkEmailExists, healthCheck, login, register } from '../controllers/authController.js';
import { handleValidationErrors, validateUserLogin, validateUserRegistration } from '../middleware/validation.js';
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


export default authRouter;