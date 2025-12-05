import Response from "../utils/Response.js";
import User from "../models/User.js";
import AuthHelpers from "../utils/AuthHelpers.js";
import { v2 as cloudinary } from 'cloudinary'
import db from "../config/db.js";
import { sendWelcomeEmail } from "../utils/Mail.js";
import { playmateWelcomeTemplate } from "../utils/emailTemplates.js";

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

    } catch (error) {
        res.status(500).json(Response.error(500, "Login failed", error.message));
    }
};



export { register, login };