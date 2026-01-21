import Venue from "../models/Venue.js";
import Response from "../utils/Response.js";
import db from "../config/db.js";
import AuthHelpers from "../utils/AuthHelpers.js";
import { playmateWelcomeTemplate } from "../utils/emailTemplates.js";
import { sendWelcomeEmail } from "../utils/Mail.js";
import { v2 as cloudinary } from 'cloudinary'
import VenueSport from "../models/VenueSport.js";
import Booking from "../models/Booking.js";

Venue.createTable().catch(console.error);
Booking.createTable().catch(console.error);

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

const getVenueDashboardStats = async (req, res) => {
    const connection = await db.getConnection();
    try {
        connection.beginTransaction();
        const { venueId } = req.params;

        const [[sports]] = await connection.query(` 
            SELECT COUNT(*) AS total_bookings FROM bookings
            WHERE venue_id = ${venueId}`);
        const [[revenue]] = await connection.query(`
            SELECT COALESCE(SUM(total_price), 0) AS total_revenue FROM bookings
            WHERE venue_id = ${venueId}`);

        const [[todaysRevenue]] = await connection.query(`
            SELECT COALESCE(SUM(total_price), 0) AS today_revenue FROM bookings
            WHERE venue_id = ${venueId} 
            AND DATE(start_datetime) = CURDATE()`);

        const [[totalSports]] = await connection.query(`
                SELECT COUNT(*) AS total_sports FROM venue_sports
                WHERE venue_id = ${venueId}`);

        connection.commit();
        res.status(200).json(Response.success(200, "Venue dashboard stats fetched successfully", {
            total_bookings: sports.total_bookings,
            total_revenue: revenue.total_revenue,
            today_revenue: todaysRevenue.today_revenue,
            total_sports: totalSports.total_sports
        }));
    } catch (error) {
        connection.rollback();
        console.error("Error fetching venue dashboard stats:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        connection.release();
    }
}

// Analytics Functions
const getDailyBookingTrend = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { venueId } = req.params;

        const [rows] = await connection.query(`
            SELECT 
                DATE(start_datetime) AS booking_date,
                COUNT(*) AS bookings
            FROM bookings
            WHERE venue_id = ?
            GROUP BY booking_date
            ORDER BY booking_date
        `, [venueId]);

        await connection.commit();
        res.status(200).json(Response.success(200, "Daily booking trend fetched successfully", rows));
    } catch (error) {
        await connection.rollback();
        console.error("Error fetching daily booking trend:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        connection.release();
    }
}

const getMonthlyRevenueTrend = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { venueId } = req.params;

        const [rows] = await connection.query(`
            SELECT 
                DATE_FORMAT(start_datetime, '%Y-%m') AS month,
                SUM(total_price) AS revenue
            FROM bookings
            WHERE venue_id = ?
            GROUP BY month
            ORDER BY month
        `, [venueId]);

        await connection.commit();
        res.status(200).json(Response.success(200, "Monthly revenue trend fetched successfully", rows));
    } catch (error) {
        await connection.rollback();
        console.error("Error fetching monthly revenue trend:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        connection.release();
    }
}

const getRevenueBySport = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { venueId } = req.params;

        const [rows] = await connection.query(`
            SELECT 
                s.sport_name,
                SUM(b.total_price) AS revenue
            FROM bookings b
            JOIN venue_sports vs ON b.venue_sport_id = vs.venue_sport_id
            JOIN sports s ON vs.sport_id = s.sport_id
            WHERE b.venue_id = ?
            GROUP BY s.sport_id
            ORDER BY revenue DESC
        `, [venueId]);

        await connection.commit();
        res.status(200).json(Response.success(200, "Revenue by sport fetched successfully", rows));
    } catch (error) {
        await connection.rollback();
        console.error("Error fetching revenue by sport:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        connection.release();
    }
}

const getRevenueBySlot = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { venueId } = req.params;

        const [rows] = await connection.query(`
            SELECT 
                sl.start_time,
                sl.end_time,
                SUM(b.total_price) AS revenue
            FROM bookings b
            JOIN slots sl ON b.slot_id = sl.slot_id
            WHERE b.venue_id = ?
            GROUP BY sl.slot_id
            ORDER BY revenue DESC
        `, [venueId]);

        await connection.commit();
        res.status(200).json(Response.success(200, "Revenue by slot fetched successfully", rows));
    } catch (error) {
        await connection.rollback();
        console.error("Error fetching revenue by slot:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        connection.release();
    }
}

const getMostBookedSlots = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { venueId } = req.params;

        const [rows] = await connection.query(`
            SELECT 
                sl.start_time,
                sl.end_time,
                COUNT(b.booking_id) AS total_bookings
            FROM bookings b
            JOIN slots sl ON b.slot_id = sl.slot_id
            WHERE b.venue_id = ?
            GROUP BY sl.slot_id
            ORDER BY total_bookings DESC
        `, [venueId]);

        await connection.commit();
        res.status(200).json(Response.success(200, "Most booked slots fetched successfully", rows));
    } catch (error) {
        await connection.rollback();
        console.error("Error fetching most booked slots:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        connection.release();
    }
}

const getPeakBookingHours = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { venueId } = req.params;

        const [rows] = await connection.query(`
            SELECT 
                HOUR(start_datetime) AS hour,
                COUNT(*) AS bookings
            FROM bookings
            WHERE venue_id = ?
            GROUP BY hour
            ORDER BY bookings DESC
        `, [venueId]);

        await connection.commit();
        res.status(200).json(Response.success(200, "Peak booking hours fetched successfully", rows));
    } catch (error) {
        await connection.rollback();
        console.error("Error fetching peak booking hours:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        connection.release();
    }
}

const getSlotUsageFrequency = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { venueId } = req.params;

        const [rows] = await connection.query(`
            SELECT 
                s.start_time,
                s.end_time,
                COUNT(b.booking_id) AS times_booked
            FROM slots s
            LEFT JOIN bookings b ON s.slot_id = b.slot_id
            WHERE s.venue_sport_id IN (
                SELECT venue_sport_id 
                FROM venue_sports 
                WHERE venue_id = ?
            )
            GROUP BY s.slot_id
            ORDER BY times_booked DESC
        `, [venueId]);

        await connection.commit();
        res.status(200).json(Response.success(200, "Slot usage frequency fetched successfully", rows));
    } catch (error) {
        await connection.rollback();
        console.error("Error fetching slot usage frequency:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        connection.release();
    }
}

const getUnusedSlots = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { venueId } = req.params;

        const [rows] = await connection.query(`
            SELECT 
                s.start_time,
                s.end_time
            FROM slots s
            LEFT JOIN bookings b ON s.slot_id = b.slot_id
            WHERE s.venue_sport_id IN (
                SELECT venue_sport_id 
                FROM venue_sports 
                WHERE venue_id = ?
            )
            GROUP BY s.slot_id
            HAVING COUNT(b.booking_id) = 0
        `, [venueId]);

        await connection.commit();
        res.status(200).json(Response.success(200, "Unused slots fetched successfully", rows));
    } catch (error) {
        await connection.rollback();
        console.error("Error fetching unused slots:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        connection.release();
    }
}

const getUniqueCustomers = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { venueId } = req.params;

        const [[result]] = await connection.query(`
            SELECT COUNT(DISTINCT user_id) AS unique_customers
            FROM bookings
            WHERE venue_id = ?
        `, [venueId]);

        await connection.commit();
        res.status(200).json(Response.success(200, "Unique customers count fetched successfully", result));
    } catch (error) {
        await connection.rollback();
        console.error("Error fetching unique customers:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        connection.release();
    }
}

const getRepeatCustomers = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { venueId } = req.params;

        const [[result]] = await connection.query(`
            SELECT COUNT(*) AS repeat_customers
            FROM (
                SELECT user_id
                FROM bookings
                WHERE venue_id = ?
                GROUP BY user_id
                HAVING COUNT(*) > 1
            ) t
        `, [venueId]);

        await connection.commit();
        res.status(200).json(Response.success(200, "Repeat customers count fetched successfully", result));
    } catch (error) {
        await connection.rollback();
        console.error("Error fetching repeat customers:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        connection.release();
    }
}

const getTopCustomers = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { venueId } = req.params;

        const [rows] = await connection.query(`
            SELECT 
                u.first_name,
                u.last_name,
                COUNT(b.booking_id) AS bookings_count
            FROM users u
            JOIN bookings b ON u.user_id = b.user_id
            WHERE b.venue_id = ?
            GROUP BY u.user_id
            ORDER BY bookings_count DESC
        `, [venueId]);

        await connection.commit();
        res.status(200).json(Response.success(200, "Top customers fetched successfully", rows));
    } catch (error) {
        await connection.rollback();
        console.error("Error fetching top customers:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        connection.release();
    }
}

const getTotalGamesHosted = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { venueId } = req.params;

        const [[result]] = await connection.query(`
            SELECT COUNT(*) AS total_games
            FROM games
            WHERE venue_id = ?
        `, [venueId]);

        await connection.commit();
        res.status(200).json(Response.success(200, "Total games hosted fetched successfully", result));
    } catch (error) {
        await connection.rollback();
        console.error("Error fetching total games hosted:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        connection.release();
    }
}

const getGamesBySport = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { venueId } = req.params;

        const [rows] = await connection.query(`
            SELECT 
                s.sport_name,
                COUNT(g.game_id) AS games_count
            FROM games g
            JOIN sports s ON g.sport_id = s.sport_id
            WHERE g.venue_id = ?
            GROUP BY s.sport_id
        `, [venueId]);

        await connection.commit();
        res.status(200).json(Response.success(200, "Games by sport fetched successfully", rows));
    } catch (error) {
        await connection.rollback();
        console.error("Error fetching games by sport:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        connection.release();
    }
}

const getRecentBookings = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { venueId } = req.params;
        const limit = req.query.limit || 5;

        const [rows] = await connection.query(`
            SELECT 
                b.booking_id,
                u.first_name,
                u.last_name,
                sl.start_time,
                sl.end_time,
                b.start_datetime,
                b.end_datetime,
                b.total_price
            FROM bookings b
            JOIN users u ON b.user_id = u.user_id
            LEFT JOIN slots sl ON b.slot_id = sl.slot_id
            WHERE b.venue_id = ?
            ORDER BY b.created_at DESC
            LIMIT ?
        `, [venueId, parseInt(limit)]);

        await connection.commit();
        res.status(200).json(Response.success(200, "Recent bookings fetched successfully", rows));
    } catch (error) {
        await connection.rollback();
        console.error("Error fetching recent bookings:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        connection.release();
    }
}

const venueSports = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { venueId } = req.params;
        const sports = await VenueSport.getVenueSports(venueId, connection);
        await connection.commit();
        res.status(200).json(Response.success(200, "Venue sports fetched successfully", sports));
    } catch (error) {
        await connection.rollback();
        console.error("Error fetching venue sports:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        connection.release();
    }
}

const CreateVenueSport = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { venue_id, sport_id } = req.body;

        if (!venue_id || !sport_id) {
            return res.status(400).json(Response.error(400, "venue_id and sport_id are required"));
        }

        const exist = await VenueSport.listByVenue(venue_id, connection);
        if (exist.some(vs => vs.sport_id === sport_id)) {
            await connection.rollback();
            return res.status(409).json(Response.error(409, "Sport already added for this venue"));
        }

        const venueSport = await VenueSport.save({ venue_id, sport_id }, connection);

        await connection.commit();
        res.status(201).json(Response.success(201, "Venue sport created successfully", venueSport));
    } catch (error) {
        await connection.rollback();
        console.error("Error creating venue sport:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        connection.release();
    }
}

const deleteVenueSport = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { venueSportId } = req.params;
        const exist = await VenueSport.findById(venueSportId, connection);
        if (!exist) {
            await connection.rollback();
            return res.status(404).json(Response.error(404, "Venue sport not found"));
        }
        await VenueSport.deleteById(venueSportId, connection);
        await connection.commit();
        res.status(200).json(Response.success(200, "Venue sport deleted successfully"));
    } catch (error) {
        await connection.rollback();
        console.error("Error deleting venue sport:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        connection.release();
    }
}

const updateVenueSport = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { venueSportId } = req.params;
        const { sport_id } = req.body;
        console.log("Updating venue sport:", venueSportId, sport_id);

        // Get current venue_sport to know which venue we're updating
        const currentVenueSport = await VenueSport.findById(venueSportId, connection);
        if (!currentVenueSport) {
            await connection.rollback();
            return res.status(404).json(Response.error(404, "Venue sport not found"));
        }

        // Check if this sport already exists for this venue (excluding current record)
        const exist = await VenueSport.existsForVenue(currentVenueSport.venue_id, sport_id, venueSportId, connection);
        console.log("Existing sport check:", exist);

        if (exist) {
            await connection.rollback();
            return res.status(409).json(Response.error(409, "Sport already added for this venue"));
        }

        const updateSuccess = await VenueSport.updateById(venueSportId, sport_id, connection);

        if (!updateSuccess) {
            await connection.rollback();
            return res.status(400).json(Response.error(400, "No valid fields to update"));
        }

        await connection.commit();
        res.status(200).json(Response.success(200, "Venue sport updated successfully"));
    } catch (error) {
        await connection.rollback();
        console.error("Error updating venue sport:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        connection.release();
    }
}

const venueBookings = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { venueId } = req.params;
        const bookings = await Booking.listByVenue(venueId, connection);
        await connection.commit();
        res.status(200).json(Response.success(200, "Venue bookings fetched successfully", bookings));
    } catch (error) {
        await connection.rollback();
        console.error("Error fetching venue bookings:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        connection.release();
    }
}

export {
    registerVenue,
    venueLogin,
    venueProfile,
    updateVenueProfile,
    getVenueDashboardStats,
    getDailyBookingTrend,
    getMonthlyRevenueTrend,
    getRevenueBySport,
    getRevenueBySlot,
    getMostBookedSlots,
    getPeakBookingHours,
    getSlotUsageFrequency,
    getUnusedSlots,
    getUniqueCustomers,
    getRepeatCustomers,
    getTopCustomers,
    getTotalGamesHosted,
    getGamesBySport,
    getRecentBookings,
    venueSports,
    CreateVenueSport,
    deleteVenueSport,
    updateVenueSport,
    venueBookings
};