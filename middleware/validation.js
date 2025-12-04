import { body, validationResult } from 'express-validator';
import Response from '../utils/Response.js';

// User registration validation rules
export const validateUserRegistration = [
    body('user_email')
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail()
        .isLength({ max: 100 })
        .withMessage('Email address is too long'),

    body('user_password')
        .isLength({ min: 8, max: 60 })
        .withMessage('Password must be between 8')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&].*$/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),

    body('first_name')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('First name is required and must be between 1 and 50 characters')
        .matches(/^[a-zA-Z\s'-]+$/)
        .withMessage('First name can only contain letters, spaces, apostrophes, and hyphens'),

    body('last_name')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Last name must be between 1 and 50 characters')
        .matches(/^[a-zA-Z\s'-]+$/)
        .withMessage('Last name can only contain letters, spaces, apostrophes, and hyphens'),

    body('profile_image')
        .optional()
        .trim()
        .isLength({ max: 165 })
        .withMessage('Profile image URL must not exceed 165 characters')
        .isURL()
        .withMessage('Profile image must be a valid URL')
];

// User login validation rules
export const validateUserLogin = [
    body('user_email')
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail(),

    body('user_password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 1, max: 60 })
        .withMessage('Password length is invalid')
];

// Mobile-friendly validation error handler middleware
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(Response.error(400, "Validation errors occurred", errors.array()));
    }
    next();
};