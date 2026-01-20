import Venue from "../models/Venue.js";
import Response from "../utils/Response.js";
import db from "../config/db.js";
import AuthHelpers from "../utils/AuthHelpers.js";
import { playmateWelcomeTemplate } from "../utils/emailTemplates.js";
import { sendWelcomeEmail } from "../utils/Mail.js";
import { v2 as cloudinary } from 'cloudinary'

Venue.createTable().catch(console.error);

const registerVenue = async (req, res) => {
    // Start transaction
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();
        const { email, first_name, last_name, phone, password } = req.body;
        // Default profile image URL
        const defaultProfileImage = "https://res.cloudinary.com/dsw5tkkyr/image/upload/v1764845539/avatar_wcaknk.png";
        let imageUrl = defaultProfileImage;

        // check if user already exists
        const existingUser = await Venue.findByEmail(email, db);

        if (existingUser) {
            await connection.rollback();
            return res.status(409).json(
                Response.error(409, "Venue with this email already exists", [
                    { field: 'venue_email', message: 'Email is already registered' }
                ])
            );
        }

        const hashedPassword = await AuthHelpers.hashPassword(password);

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
            email,
            password: hashedPassword,
            first_name,
            last_name,
            profile_image: imageUrl,
            phone,
            venue_name: '',
            address: ''
        };

        const newUser = await Venue.save(userData, connection);

        //  generate auth token
        const token = await AuthHelpers.generateToken(newUser);

        // Send welcome email
        console.log("Sending welcome email to:", email);
        const html = playmateWelcomeTemplate({ name: first_name });
        const emailResult = await sendWelcomeEmail(email, "Welcome to Playmate!", html);
        console.log("Welcome email result:", emailResult);

        // COMMIT transaction
        await connection.commit();

        res.status(201).json(
            Response.success(201, "Venue registered successfully", {
                venue: newUser,
                token
            })
        );
    } catch (error) {
        await connection.rollback();
        console.error("Error registering venue:", error);
        res.status(500).json(Response.error(500, "Internal server error"));
    } finally {
        connection.release();
    }
}


const venueLogin = async (req, res) => {
    const connection = await db.getConnection();
    try {
        connection.beginTransaction();
        const { email, password } = req.body;
        // check if venue exists
        const venue = await Venue.findByEmail(email, connection);

        if (!venue) {
            await connection.rollback();
            return res.status(404).json(
                Response.error(404, "Venue not found")
            );
        }

        const isPasswordValid = await AuthHelpers.isPasswordValid(venue.password, password);

        if (!isPasswordValid) {
            await connection.rollback();
            return res.status(401).json(
                Response.error(401, "Email or password is incorrect")
            );
        }

        delete venue.password;

        // generate auth token
        const token = await AuthHelpers.generateToken(venue);

        await connection.commit();

        res.status(200).json(
            Response.success(200, "Venue logged in successfully", venue, token)
        );

    } catch (error) {
        console.error("Error during venue login:", error);
        res.status(500).json(Response.error(500, "Internal server error"));
    } finally {
        connection.release();
    }
}

const venueProfile = async (req, res) => {
    const connection = await db.getConnection();
    try {
        connection.beginTransaction();

        const { venueId } = req.params;

        if (!venueId || isNaN(venueId)) {
            return res.status(400).json(Response.error(400, "Invalid venue ID"));
        }

        const venue = await Venue.findById(venueId, connection);

        delete venue.password;

        await connection.commit();

        res.status(200).json(Response.success(200, "Venue Profile retrieved successfully", { venue }));

    } catch (error) {
        await connection.rollback();
        console.error("Error fetching venue profile:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        connection.release();
    }
}

const updateVenueProfile = async (req, res) => {
    const connection = await db.getConnection();
    try {
        connection.beginTransaction();
        const { venueId } = req.params;
        const updates = req.body;
        
        const exist = await Venue.findById(venueId, connection);
        if (!exist) {
            await connection.rollback();
            return res.status(404).json(Response.error(404, "Venue not found"));
        }

        if (req.file) {
            try {
                const imageUpload = await cloudinary.uploader.upload(req.file.path, { resource_type: "image" });
                updates.profile_image = imageUpload.secure_url;
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError);
            }
        }

        const updateSuccess = await Venue.updateProfile(venueId, updates, connection);
        if (!updateSuccess) {
            await connection.rollback();
            return res.status(400).json(Response.error(400, "No valid fields to update"));
        }
        const updatedVenue = await Venue.findById(venueId, connection);

        delete updatedVenue.password;
        await connection.commit();
        res.status(200).json(Response.success(200, "Venue profile updated successfully", { venue: updatedVenue }));

    } catch (error) {
        await connection.rollback();
        console.error("Error updating venue profile:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        connection.release();
    }
}

export { registerVenue, venueLogin, venueProfile, updateVenueProfile };