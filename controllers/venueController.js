import VenueOwner from "../models/VenueOwner.js";
import AuthHelpers from "../utils/AuthHelpers.js";
import Response from "../utils/Response.js";
import { v2 as cloudinary } from 'cloudinary'
import db from "../config/db.js";
import { playmateWelcomeTemplate } from "../utils/emailTemplates.js";
import { sendWelcomeEmail } from "../utils/Mail.js";
import bcrypt from "bcryptjs";
import Venue from "../models/Venue.js";

VenueOwner.createTable().catch(console.error);
Venue.createTable().catch(console.error);

const register = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { email, password, first_name, last_name, phone } = req.body;
        const defaultProfileImage = "https://res.cloudinary.com/dsw5tkkyr/image/upload/v1764845539/avatar_wcaknk.png";
        let imageUrl = defaultProfileImage;

        if (!email || !password || !first_name || !phone) {
            await connection.rollback();

            return res.status(400).json(Response.error(400, 'Missing required fields'));
        }

        const existing = await VenueOwner.findByEmail(email);
        if (existing) {
            await connection.rollback();

            return res.status(409).json(Response.error(409, 'Email already in use'));
        }


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

        const hashed = await AuthHelpers.hashPassword(password);
        const owner = await VenueOwner.save({ email, password: hashed, first_name, last_name, phone, profile_image: imageUrl }, connection);
        const safe = { ...owner, password: undefined };
        //  generate auth token
        const token = await AuthHelpers.generateToken({ id: owner.id, email: owner.email });


        // Send welcome email
        console.log("Sending welcome email to:", email);
        const html = playmateWelcomeTemplate({ name: first_name });
        const emailResult = await sendWelcomeEmail(email, "Welcome to Playmate!", html);

        await connection.commit();

        return res.status(201).json(Response.success(201, 'Owner created', safe, token));
    } catch (e) {
        await connection.rollback();
        return res.status(500).json(Response.error(500, 'Failed to register owner', e.message));
    } finally {
        connection.release();
    }
}

const login = async (req, res) => {
    const connection = await db.getConnection();

    try {
        const { email, password } = req.body;
        console.log("Login attempt for email:", email);

        if (!email || !password) {
            return res.status(400).json(Response.error(400, 'Missing email or password'));
        }

        const owner = await VenueOwner.findByEmail(email);

        if (!owner) return res.status(404).json(Response.error(404, 'Owner not found'));

        const match = await AuthHelpers.isPasswordValid(owner.password, password);

        if (!match) return res.status(401).json(Response.error(401, 'Invalid credentials'));

        const safe = { ...owner, password: undefined };
        //  generate auth token
        const token = await AuthHelpers.generateToken({ user_id: owner.venue_owners_id, email: owner.email });

        await connection.commit();

        return res.status(200).json(Response.success(200, 'Login successful', safe, token));
    } catch (e) {
        await connection.rollback();
        console.error('Login error:', e);
        return res.status(500).json(Response.error(500, 'Login failed', e.message));
    } finally {
        await connection.release();
    }
}

const profile = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const id = req.user.venue_owners_id;

        const owner = await VenueOwner.findById(id);

        if (!owner) return res.status(404).json(Response.error(404, 'Owner not found'));

        const safe = { ...owner, password: undefined };

        await connection.commit();
        return res.status(200).json(Response.success(200, 'Owner profile', safe));
    } catch (e) {
        return res.status(500).json(Response.error(500, 'Failed to fetch owner', e.message));
    } finally {
        await connection.release();
    }
}


export {
    register,
    login,
    profile,
};