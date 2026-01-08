import UserSport from "../models/UserSport.js";
import Response from "../utils/Response.js";
import db from "../config/db.js";
import User from "../models/User.js";
import { v2 as cloudinary } from 'cloudinary'

UserSport.createTable().catch(console.error);
User.createTable().catch(console.error);

const updateUserDetails = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { user_email, first_name, last_name } = req.body;
        let profile_image = null;

        // upload image to cloudinary only if file is provided
        if (req.file) {
            try {
                const imageUpload = await cloudinary.uploader.upload(req.file.path, { resource_type: "image" });
                profile_image = imageUpload.secure_url;
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError);
                // If upload fails, use default image
                profile_image = defaultProfileImage;
            }
        }

        // Validate required fields
        if (!user_email || !first_name) {
            await connection.rollback();
            return res.status(400).json(Response.error(400, "Email and first name are required"));
        }

        // Check if user exists
        const existingUser = await User.findByEmail(user_email, connection);
        if (!existingUser) {
            await connection.rollback();
            return res.status(404).json(Response.error(404, "User not found"));
        }

        // Build user object with only fields to update
        const user = {
            user_email,
            first_name,
            last_name: last_name || existingUser.last_name,
            profile_image: profile_image || existingUser.profile_image
        };

        // Update user details
        await User.updateUserDetails(user, connection);

        // Fetch updated user data
        const updatedUser = await User.findByEmail(user_email, connection);

        await connection.commit();

        res.status(200).json(Response.success(
            200,
            "User details updated successfully",
            {
                user: {
                    user_id: updatedUser.user_id,
                    user_email: updatedUser.user_email,
                    first_name: updatedUser.first_name,
                    last_name: updatedUser.last_name,
                    profile_image: updatedUser.profile_image
                }
            }
        ));

    } catch (error) {
        await connection.rollback();
        console.error("Error updating user details:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        connection.release();
    }
}

const addUserSport = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { user_id, sport_id, skill_level } = req.body;

        if (!user_id || isNaN(user_id)) {
            await connection.rollback();
            return res.status(400).json(Response.error(400, "Invalid user ID"));
        }

        if (!sport_id || isNaN(sport_id)) {
            await connection.rollback();
            return res.status(400).json(Response.error(400, "Invalid sport ID"));
        }

        const existingUserSport = await UserSport.findByUserAndSport(user_id, sport_id, connection);
        if (existingUserSport) {
            await connection.rollback();
            return res.status(409).json(Response.error(409, "User sport already exists"));
        }

        const userSportData = { user_id, sport_id, skill_level };
        const newUserSportId = await UserSport.addUserSport(userSportData, connection);

        await connection.commit();
        res.status(201).json(Response.success(201, "User sport added successfully", { user_sport_id: newUserSportId }));
    } catch (error) {
        await connection.rollback();
        console.error("Error adding user sport:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        connection.release();
    }
}

const userProfile = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const { userId } = req.params;
        if (!userId || isNaN(userId)) {
            return res.status(400).json(Response.error(400, "Invalid user ID"));
        }
        
        const user = await User.findById(userId, connection);

        res.status(200).json(Response.success(200, "User retrieved successfully", { user }));

    }catch (error) {
        await connection.rollback();
        console.error("Error fetching user sports:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        connection.release();
    }
}

const deleteUserSport = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        
        const { user_id, sport_id } = req.params;

        if (!user_id || isNaN(user_id)) {
            await connection.rollback();
            return res.status(400).json(Response.error(400, "Invalid user ID"));
        }

        if (!sport_id || isNaN(sport_id)) {
            await connection.rollback();
            return res.status(400).json(Response.error(400, "Invalid sport ID"));
        }

        const existingUserSport = await UserSport.findByUserAndSport(user_id, sport_id, connection);
        if (!existingUserSport) {
            await connection.rollback();
            return res.status(404).json(Response.error(404, "User sport not found"));
        }

        await UserSport.removeUserSport(user_id, sport_id, connection);

        await connection.commit();
        res.status(200).json(Response.success(200, "User sport deleted successfully"));
    } catch (error) {
        await connection.rollback();
        console.error("Error deleting user sport:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        connection.release();
    }
}

export { addUserSport, updateUserDetails, userProfile, deleteUserSport };