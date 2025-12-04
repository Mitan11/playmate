import express from 'express';
import { login, register } from '../controllers/authController.js';
import { handleValidationErrors, validateUserLogin, validateUserRegistration } from '../middleware/validation.js';
import upload from '../middleware/multer.js';

const authRouter = express.Router();

// User registration route
authRouter.post('/register', upload.single('profile_image'), validateUserRegistration, handleValidationErrors, register);

// User login route
authRouter.post('/login', validateUserLogin, handleValidationErrors, login);

authRouter.get('/health', (req, res) => {
    res.status(200).json({
        status: true,
        statusCode: 200,
        message: 'Auth API is healthy',
        data: {
            service: 'auth',
            version: '1.0.0'
        },
        timestamp: new Date().toISOString()
    });
});

// Check email availability
authRouter.post('/check-email', async (req, res) => {
    try {
        const { user_email } = req.body;

        if (!user_email) {
            return res.status(400).json({
                status: false,
                statusCode: 400,
                message: 'Email is required',
                errors: [{ field: 'user_email', message: 'Email is required' }],
                timestamp: new Date().toISOString()
            });
        }

        const { default: User } = await import('../models/User.js');
        const existingUser = await User.findByEmail(user_email);

        res.status(200).json({
            status: true,
            statusCode: 200,
            message: 'Email availability checked',
            data: {
                available: !existingUser,
                user_email: user_email
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Email check error:', error);
        res.status(500).json({
            status: false,
            statusCode: 500,
            message: 'Error checking email availability',
            errors: [{ field: 'server', message: 'Something went wrong. Please try again later.' }],
            timestamp: new Date().toISOString()
        });
    }
});


export default authRouter;