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
        .withMessage('Email address is too long')
        .toLowerCase()
        ,

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
];

// User login validation rules
export const validateUserLogin = [
    body('user_email')
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail()
        .toLowerCase(),

    body('user_password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 1, max: 60 })
        .withMessage('Password length is invalid')
];

// Reset password email validation
export const validateResetPasswordEmail = [
    body('user_email')
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail()
        .toLowerCase()
];

// OTP verification validation
export const validateOtp = [
    body('otp')
        .isLength({ min: 4, max: 4 })
        .withMessage('OTP must be 4 digits')
        .isNumeric()
        .withMessage('OTP must contain only numbers')
];

// Reset password validation
export const validateResetPassword = [
    body('user_email')
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail()
        .toLowerCase(),
    body('new_password')
        .isLength({ min: 8, max: 60 })
        .withMessage('Password must be 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&].*$/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character')
];

// Change password validation
export const validateChangePassword = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),

    body('newPassword')
        .isLength({ min: 8, max: 60 })
        .withMessage('New password must be 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&].*$/)
        .withMessage('New password must contain at least one lowercase letter, one uppercase letter, one number, and one special character')
];

// Mobile-friendly validation error handler middleware
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Transform errors into field-specific format for frontend
        const fieldErrors = {};
        errors.array().forEach(error => {
            const fieldName = error.path;
            // Convert field names to frontend-friendly format
            let errorKey = fieldName;
            if (fieldName === 'user_email') {
                errorKey = 'email_error';
            } else if (fieldName === 'user_password') {
                errorKey = 'password_error';
            } else if (fieldName === 'first_name') {
                errorKey = 'first_name_error';
            } else if (fieldName === 'last_name') {
                errorKey = 'last_name_error';
            } else if (fieldName === 'new_password') {
                errorKey = 'new_password_error';
            } else if (fieldName === 'currentPassword') {
                errorKey = 'current_password_error';
            } else if (fieldName === 'newPassword') {
                errorKey = 'new_password_error';
            } else if (fieldName === 'otp') {
                errorKey = 'otp_error';
            } else {
                errorKey = fieldName + '_error';
            }
            fieldErrors[errorKey] = error.msg;
        });
        
        return res.status(400).json(Response.error(400, "Validation errors occurred", fieldErrors));
    }
    next();
};