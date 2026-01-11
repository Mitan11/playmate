import Response from "../utils/Response.js";
import User from "../models/User.js";
import AuthHelpers from "../utils/AuthHelpers.js";
import { v2 as cloudinary } from 'cloudinary'
import db from "../config/db.js";
import { sendEmail, sendWelcomeEmail } from "../utils/Mail.js";
import { playmateWelcomeTemplate, resetPasswordTemplate } from "../utils/emailTemplates.js";
import os from "os";

// Initialize database table
User.createTable().catch(console.error);

// User registration controller
const register = async (req, res) => {
    // connection pool
    const connection = await db.getConnection();

    try {
        // Start transaction
        await connection.beginTransaction();

        const { first_name, last_name, user_email, user_password } = req.body;

        // Default profile image URL
        const defaultProfileImage = "https://res.cloudinary.com/dsw5tkkyr/image/upload/v1764845539/avatar_wcaknk.png";
        let imageUrl = defaultProfileImage;

        // check if user already exists
        const existingUser = await User.findByEmail(user_email, connection);

        if (existingUser) {
            await connection.rollback();
            return res.status(409).json(
                Response.error(409, "User with this email already exists", [
                    { field: 'user_email', message: 'Email is already registered' }
                ])
            );
        }

        // password hashing and user creation logic goes here
        const hashedPassword = await AuthHelpers.hashPassword(user_password);

        // upload image to cloudinary only if file is provided
        if (req.file) {
            try {
                const imageUpload = await cloudinary.uploader.upload(req.file.path, { resource_type: "image" });
                imageUrl = imageUpload.secure_url;
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError);
                // If upload fails, use default image
                imageUrl = defaultProfileImage;
            }
        }

        // Create new user in the database
        const userData = {
            user_email,
            user_password: hashedPassword,
            first_name,
            last_name,
            profile_image: imageUrl,
        };

        // Save new user to database using static method
        const result = await User.save(userData, connection);

        //  generate auth token
        const token = await AuthHelpers.generateToken(result);

        // Send welcome email
        console.log("Sending welcome email to:", user_email);
        const html = playmateWelcomeTemplate({ name: first_name });
        const emailResult = await sendWelcomeEmail(user_email, "Welcome to Playmate!", html);
        console.log("Welcome email result:", emailResult);
        // COMMIT transaction
        await connection.commit();

        // Respond with success 
        res.status(201).json(Response.success(201, "User registered successfully", result, token));
    } catch (error) {
        // rollback transaction in case of error
        await connection.rollback();
        console.log(error);
        res.status(500).json(Response.error(500, "Registration failed", error.message));
    } finally {
        // release connection back to pool
        connection.release();
    }
};

// User login controller
const login = async (req, res) => {
    try {

        const { user_email, user_password } = req.body;

        // Find user by email
        const user = await User.findByEmail(user_email);

        if (!user) {
            return res.status(404).json(
                Response.error(404, "incorrect email or password")
            );
        }

        // Validate password
        const isPasswordValid = await AuthHelpers.isPasswordValid(user.user_password, user_password);
        if (!isPasswordValid) {
            return res.status(401).json(
                Response.error(401, "incorrect email or password")
            );
        }

        delete user.user_password;

        // Generate auth token
        const token = await AuthHelpers.generateToken(user);

        // Respond with success
        res.status(200).json(Response.success(200, "Login successful", user, token));

    } catch (error) {
        res.status(500).json(Response.error(500, "Login failed", error.message));
    }
};

const healthCheck = async (req, res) => {
    // Health check for the Auth API
    const start = Date.now();

    // DB status
    let dbStatus = "down";
    try {
        // Simple query to check DB connectivity
        await db.query("SELECT 1");
        dbStatus = "up";
    } catch (err) {
        dbStatus = "down";
    }

    // System metrics
    const memory = process.memoryUsage();
    const cpuLoad = os.loadavg();
    const uptime = process.uptime();

    // Respond with health status
    res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Auth API is healthy",
        data: {
            service: "auth",
            version: "1.0.0",
            environment: process.env.NODE_ENV || "development",
            uptime: `${uptime.toFixed(2)} seconds`,
            responseTime: `${Date.now() - start}ms`,
            database: dbStatus,
            system: {
                memory: {
                    rss: memory.rss,
                    heapUsed: memory.heapUsed,
                    heapTotal: memory.heapTotal
                },
                cpu: {
                    load1m: cpuLoad[0],
                    load5m: cpuLoad[1],
                    load15m: cpuLoad[2]
                }
            }
        },
        timestamp: new Date().toISOString()
    });
};

const checkEmailExists = async (req, res) => {
    try {
        const { user_email } = req.body;

        // Validate email presence
        if (!user_email) {
            return res.status(400).json(Response.error(400, "Email is required",
                { field: 'user_email', message: 'Please provide an email address' }
            ));
        }

        // Check if user exists
        const { default: User } = await import('../models/User.js');
        const existingUser = await User.findByEmail(user_email);

        // Respond with availability status
        res.status(200).json({
            status: true,
            statusCode: 200,
            message: 'Email availability checked',
            data: {
                available: !existingUser,
                user_email: user_email,
                message: existingUser ? "Email is already registered" : "Email is available"
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Email check error:', error);
        res.status(500).json(Response.error(500, "Failed to check email availability", error.message));
    }
}

const sendResetPasswordEmail = async (req, res) => {
    try {
        const { user_email } = req.body;

        // Find user by email
        const user = await User.findByEmail(user_email);

        if (!user) {
            return res.status(404).json(Response.error(404, "User not found"));
        }

        // Generate OTP
        const resetOtp = AuthHelpers.generateOtp();

        // Prepare email template
        const resetPasswordTemplateContent = resetPasswordTemplate(resetOtp);

        // Send Email
        await sendEmail(
            user_email,
            "Password Reset Request",
            resetPasswordTemplateContent
        );

        return res.status(200).json(
            Response.success(200, "Password reset OTP sent", {
                resetOtp: resetOtp // for testing purposes only,
            })
        );

    } catch (error) {
        console.error("Password reset error:", error);
        return res.status(500).json(
            Response.error(500, "Password reset failed", error.message)
        );
    }
};


const resetPassword = async (req, res) => {
    try {
        const { user_email, new_password } = req.body;

        // Find user by email
        const user = await User.findByEmail(user_email);

        // If user not found
        if (!user) {
            return res.status(404).json(Response.error(404, "User not found"));
        }

        // Hash new password
        const hashedPassword = await AuthHelpers.hashPassword(new_password);

        // Update user's password in the database
        await User.updatePassword(user_email, hashedPassword);

        return res.status(200).json(
            Response.success(200, "Password has been reset successfully")
        );
    } catch (error) {
        console.error("Reset password error:", error);
        return res.status(500).json(
            Response.error(500, "Reset password failed", error.message)
        );
    }
}

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user_email = req.user.user_email; // Get email from JWT token

        // Find user by email
        const user = await User.findByEmail(user_email);

        if (!user) {
            return res.status(404).json(Response.error(404, "User not found"));
        }

        // Validate current password
        const isPasswordValid = await AuthHelpers.isPasswordValid(user.user_password, currentPassword);

        if (!isPasswordValid) {
            return res.status(400).json(Response.error(400, "Current password is incorrect"));
        }

        // Hash new password
        const hashedPassword = await AuthHelpers.hashPassword(newPassword);

        // Update user's password in the database
        await User.updatePassword(user_email, hashedPassword);

        // sending the response
        return res.status(200).json(Response.success(200, "Password changed successfully"));
    } catch (error) {
        console.error("Error changing password:", error);
        return res.status(500).json(Response.error(500, "Failed to change password", error.message));
    }
}

import JWT from "jsonwebtoken";

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("Admin login attempt:", email);


        if (email != "admin@playmate.com" && password != "admin123") {
            return res.status(401).json(Response.error(401, "Incorrect Credentials"));
        }

        const adminUser = {
            user_email: email,
            role: "admin"
        };

        const token = JWT.sign({ id: adminUser.user_email }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        });

        req.user = adminUser;

        return res.status(200).json(Response.success(200, "Admin login successful", adminUser, token));
    } catch (error) {
        res.status(500).json(Response.error(500, "Admin login failed", error.message));
    }
}

export { register, login, healthCheck, checkEmailExists, sendResetPasswordEmail, resetPassword, changePassword, adminLogin };