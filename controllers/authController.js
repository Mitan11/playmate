import Response from "../utils/Response.js";
import User from "../models/User.js";
import AuthHelpers from "../utils/AuthHelpers.js";
import { v2 as cloudinary } from 'cloudinary'
import db from "../config/db.js";
import { sendWelcomeEmail } from "../utils/Mail.js";
import { playmateWelcomeTemplate } from "../utils/emailTemplates.js";
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

        // COMMIT transaction
        await connection.commit();

        // Send welcome email
        const html = playmateWelcomeTemplate({ name: first_name });
        await sendWelcomeEmail(user_email, "Welcome to Playmate!", html);

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

export { register, login, healthCheck, checkEmailExists };