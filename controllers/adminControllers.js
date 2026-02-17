import db from "../config/db.js";
import Sport from "../models/Sport.js";
import capitalizeFirstLetter from "../utils/capitalize.js";
import Response from "../utils/Response.js";
import AuthHelpers from "../utils/AuthHelpers.js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import User from "../models/User.js";
import Venue from "../models/Venue.js";
import Post from "../models/Post.js";
dayjs.extend(relativeTime);

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email !== "admin@playmate.com" || password !== "admin@123") {
            return res.status(401).json(Response.error(401, "Incorrect Credentials"));
        }

        const adminUser = {
            id: 0,
            user_email: email,
            role: "admin"
        };

        const token = await AuthHelpers.generateToken(adminUser);

        req.user = adminUser;

        return res.status(200).json(Response.success(200, "Admin login successful", adminUser, token));
    } catch (error) {
        res.status(500).json(Response.error(500, "Admin login failed", error.message));
    }
}

const getAllSports = async (req, res) => {
    const connection = await db.getConnection();
    try {
        connection.beginTransaction();

        const sports = await Sport.getAllSports(connection);
        await connection.commit();

        res.status(200).json(
            Response.success(200, "Sports fetched successfully", sports)
        );
    } catch (error) {
        await connection.rollback();
        res.status(500).json(
            Response.error(500, "Failed to fetch sports")
        );
    } finally {
        connection.release();
    }
}

const addSport = async (req, res) => {
    const connection = await db.getConnection();
    try {
        connection.beginTransaction();
        const { sport_name } = req.body;

        const trimmedSportName = capitalizeFirstLetter(sport_name.trim());

        const exist = await Sport.findByName(trimmedSportName, connection);

        if (exist && exist.sport_name.toLowerCase() === trimmedSportName.toLowerCase()) {
            await connection.rollback();
            return res.status(409).json(
                Response.error(409, "Sport already exists")
            );
        }

        const sport = await Sport.addSport(trimmedSportName, connection);

        await connection.commit();
        res.status(201).json(
            Response.success(201, "Sport added successfully", sport)
        );
    }
    catch (error) {
        await connection.rollback();
        console.error("Error adding sport:", error);
        res.status(500).json(
            Response.error(500, "Failed to add sport")
        );
    } finally {
        connection.release();
    }
}

const updateSport = async (req, res) => {
    const connection = await db.getConnection();
    try {
        connection.beginTransaction();
        const { sport_id } = req.params;
        const { sport_name } = req.body;

        const trimmedSportName = capitalizeFirstLetter(sport_name.trim());

        const exist = await Sport.findByName(trimmedSportName, connection);

        if (exist && exist.sport_name.toLowerCase() === trimmedSportName.toLowerCase()) {
            await connection.rollback();
            return res.status(409).json(
                Response.error(409, "Sport already exists")
            );
        }

        const sport = await Sport.updateSport(sport_id, trimmedSportName, connection);

        await connection.commit();

        res.status(200).json(
            Response.success(200, "Sport updated successfully", sport)
        );

    } catch (error) {
        res.status(500).json(
            Response.error(500, "Failed to update sport")
        );
    } finally {
        connection.release();
    }
}

const deleteSport = async (req, res) => {
    const connection = await db.getConnection();
    try {
        connection.beginTransaction();
        const { sport_id } = req.params;

        const sport = await Sport.deleteSport(sport_id, connection);

        await connection.commit();

        if (!sport) {
            return res.status(404).json(
                Response.error(404, "Sport not found")
            );
        }

        res.status(200).json(
            Response.success(200, "Sport deleted successfully", sport)
        );

    } catch (error) {
        await connection.rollback();
        res.status(500).json(
            Response.error(500, "Failed to delete sport")
        );
    } finally {
        connection.release();
    }
}

const getDashboardStats = async (req, res) => {
    const connection = await db.getConnection();
    try {
        connection.beginTransaction();
        const [[sports]] = await connection.query(
            "SELECT COUNT(*) AS totalSports FROM sports"
        );

        const [[sessions]] = await connection.query(
            "SELECT COUNT(*) AS activeSessions FROM games WHERE status = 'active'"
        );

        const [[users]] = await connection.query(
            "SELECT COUNT(*) AS totalUsers FROM users"
        );

        const [[revenue]] = await connection.query(
            "SELECT IFNULL(SUM(total_price),0) AS revenue FROM bookings"
        );

        const [[venues]] = await connection.query("SELECT COUNT(*) AS totalVenues FROM venues");

        const [[posts]] = await connection.query("SELECT COUNT(*) AS totalPosts FROM posts");

        await connection.commit();
        res.status(200).json(
            Response.success(200, "Dashboard stats fetched successfully", {
                totalSports: sports.totalSports,
                activeSessions: sessions.activeSessions,
                totalUsers: users.totalUsers,
                totalRevenue: revenue.revenue,
                totalVenue : venues.totalVenues,
                totalPosts : posts.totalPosts
            })
        );

    } catch (err) {
        await connection.rollback();
        res.status(500).json(Response.error(500, "Failed to fetch dashboard stats"));
    } finally {
        connection.release();
    }
};

const getSportMetrics = async (req, res) => {
    try {
        const [rows] = await db.query(`
                SELECT 
                    s.sport_name AS name,
                    COUNT(b.booking_id) AS users
                FROM sports s
                LEFT JOIN games g ON g.sport_id = s.sport_id
                LEFT JOIN bookings b ON b.game_id = g.game_id
                GROUP BY s.sport_id
                ORDER BY users DESC
        `);

        const maxUsers = Math.max(...rows.map(r => r.users), 1);

        const result = rows.map(r => ({
            name: r.name,
            users: r.users,
            progress: Math.round((r.users / maxUsers) * 100)
        }));

        res.status(200).json(Response.success(200, "Sport metrics fetched successfully", result));
    } catch (err) {
        res.status(500).json({ message: "Sport metrics failed" });
    }
};

const getBookingMetrics = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT DATE(created_at) AS date, COUNT(*) AS bookings
            FROM bookings
            GROUP BY DATE(created_at)
            ORDER BY date DESC
        `);

        const max = Math.max(...rows.map(r => r.bookings), 1);

        const data = rows.map(r => ({
            name: r.name,
            users: r.bookings,
            progress: Math.round((r.bookings / max) * 100)
        }));

        res.json(Response.success(200, "Booking report fetched successfully", data));
    } catch (err) {
        res.status(500).json(Response.error(500, "Booking report failed"));
    }
};

const getRecentActivities = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
              u.first_name,
              u.last_name,
              s.sport_name,
              b.created_at
            FROM bookings b
            JOIN users u ON u.user_id = b.user_id
            JOIN venue_sports vs ON vs.venue_sport_id = b.venue_sport_id
            JOIN sports s ON s.sport_id = vs.sport_id
            ORDER BY b.created_at DESC
            LIMIT 5;
        `);

        const activities = rows.map(r => ({
            title: `${r.sport_name} Court Booked`,
            user: `${r.first_name} ${r.last_name}`,
            time: dayjs(r.created_at).fromNow()
        }));

        res.status(200).json(Response.success(200, "Recent activities fetched successfully", activities));
    } catch (err) {
        res.status(500).json(Response.error(500, "Recent activities failed"));
    }
};

const getBookingReport = async (req, res) => {
    try {
        const [rows] = await db.query(`
        SELECT 
          DATE(created_at) AS date,
          COUNT(*) AS bookings
        FROM bookings
        GROUP BY DATE(created_at)
        ORDER BY date;
    `);
        res.json(Response.success(200, "Booking report fetched successfully", rows));
    } catch (err) {
        res.status(500).json(Response.error(500, "Booking report failed"));
    }
};

const getRevenueReport = async (req, res) => {
    try {
        const [rows] = await db.query(`
        SELECT DATE(created_at) AS date, SUM(total_price) AS revenue
        FROM bookings
        GROUP BY DATE(created_at)
        ORDER BY date DESC
    `);
        res.json(Response.success(200, "Revenue report fetched successfully", rows));
    } catch (err) {
        res.status(500).json(Response.error(500, "Revenue report failed"));
    }
};

const getUserReport = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT DATE(created_at) AS date, COUNT(*) AS users
            FROM users
            GROUP BY DATE(created_at)
            ORDER BY date DESC
        `);
        res.json(Response.success(200, "User report fetched successfully", rows));
    } catch (err) {
        res.status(500).json(Response.error(500, "User report failed"));
    }
};

const getAllUsers = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const users = await User.getAllUsersDetails(connection);

        // Group users by user_id and combine their sports
        const userMap = new Map();

        users.forEach(user => {
            const { sport_name, skill_level, password, ...userDetails } = user;

            if (!userMap.has(user.user_id)) {
                userMap.set(user.user_id, {
                    ...userDetails,
                    sports: []
                });
            }

            if (sport_name && skill_level) {
                userMap.get(user.user_id).sports.push({
                    sport_name,
                    skill_level
                });
            }
        });


        const combinedUsers = Array.from(userMap.values());
        res.status(200).json(Response.success(200, "Users fetched successfully", combinedUsers));
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json(Response.error(500, "Failed to fetch users"));
    } finally {
        connection.release();
    }
};

const deleteUser = async (req, res) => {
    try {
        const { user_id } = req.params;

        if (!user_id) {
            return res.status(400).json({
                status: false,
                statusCode: 400,
                message: 'User ID is required',
            });
        }

        // Check if user exists
        const [user] = await db.query(
            'SELECT user_id FROM users WHERE user_id = ?',
            [user_id]
        );

        if (user.length === 0) {
            return res.status(404).json({
                status: false,
                statusCode: 404,
                message: 'User not found',
            });
        }

        await db.query(
            'DELETE FROM users WHERE user_id = ?',
            [user_id]
        );

        return res.status(200).json({
            status: true,
            statusCode: 200,
            message: 'User deleted successfully',
            data: { user_id },
            timestamp: new Date(),
        });

    } catch (error) {
        console.error('Delete user error:', error);
        return res.status(500).json({
            status: false,
            statusCode: 500,
            message: 'Internal server error',
        });
    }
};

// User Growth Analytics (Monthly)
const getUserGrowthReport = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                DATE_FORMAT(created_at, '%Y-%m') AS month,
                COUNT(*) AS users_registered
            FROM users
            GROUP BY month
            ORDER BY month
        `);
        res.json(Response.success(200, "User growth report fetched successfully", rows));
    } catch (err) {
        console.error('User growth report error:', err);
        res.status(500).json(Response.error(500, "User growth report failed"));
    }
};

// Venue Growth Analytics (Monthly)
const getVenueGrowthReport = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                DATE_FORMAT(created_at, '%Y-%m') AS month,
                COUNT(*) AS venues_added
            FROM venues
            GROUP BY month
            ORDER BY month
        `);
        res.json(Response.success(200, "Venue growth report fetched successfully", rows));
    } catch (err) {
        console.error('Venue growth report error:', err);
        res.status(500).json(Response.error(500, "Venue growth report failed"));
    }
};

// Booking Trend Analytics (Daily)
const getBookingTrendReport = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                DATE(start_datetime) AS date,
                COUNT(*) AS total_bookings
            FROM bookings
            GROUP BY date
            ORDER BY date
        `);
        res.json(Response.success(200, "Booking trend report fetched successfully", rows));
    } catch (err) {
        console.error('Booking trend report error:', err);
        res.status(500).json(Response.error(500, "Booking trend report failed"));
    }
};

// Monthly Revenue Analytics
const getMonthlyRevenueReport = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                DATE_FORMAT(start_datetime, '%Y-%m') AS month,
                SUM(total_price) AS revenue
            FROM bookings
            GROUP BY month
            ORDER BY month
        `);
        res.json(Response.success(200, "Monthly revenue report fetched successfully", rows));
    } catch (err) {
        console.error('Monthly revenue report error:', err);
        res.status(500).json(Response.error(500, "Monthly revenue report failed"));
    }
};

// Revenue by Venue Analytics
const getRevenueByVenue = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                v.venue_name,
                SUM(b.total_price) AS revenue
            FROM venues v
            JOIN bookings b ON v.venue_id = b.venue_id
            GROUP BY v.venue_id
            ORDER BY revenue DESC
        `);
        res.json(Response.success(200, "Revenue by venue report fetched successfully", rows));
    } catch (err) {
        console.error('Revenue by venue report error:', err);
        res.status(500).json(Response.error(500, "Revenue by venue report failed"));
    }
};

// Revenue by Sport Analytics
const getRevenueBySport = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                s.sport_name,
                SUM(b.total_price) AS revenue
            FROM bookings b
            JOIN venue_sports vs ON b.venue_sport_id = vs.venue_sport_id
            JOIN sports s ON vs.sport_id = s.sport_id
            GROUP BY s.sport_id
            ORDER BY revenue DESC
        `);
        res.json(Response.success(200, "Revenue by sport report fetched successfully", rows));
    } catch (err) {
        console.error('Revenue by sport report error:', err);
        res.status(500).json(Response.error(500, "Revenue by sport report failed"));
    }
};

// Most Played Sports Analytics
const getMostPlayedSports = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                s.sport_name,
                COUNT(g.game_id) AS total_games
            FROM sports s
            JOIN games g ON s.sport_id = g.sport_id
            GROUP BY s.sport_id
            ORDER BY total_games DESC
        `);
        res.json(Response.success(200, "Most played sports report fetched successfully", rows));
    } catch (err) {
        console.error('Most played sports report error:', err);
        res.status(500).json(Response.error(500, "Most played sports report failed"));
    }
};

// Most Booked Venues Analytics
const getMostBookedVenues = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                v.venue_name,
                COUNT(b.booking_id) AS booking_count
            FROM venues v
            JOIN bookings b ON v.venue_id = b.venue_id
            GROUP BY v.venue_id
            ORDER BY booking_count DESC
        `);
        res.json(Response.success(200, "Most booked venues report fetched successfully", rows));
    } catch (err) {
        console.error('Most booked venues report error:', err);
        res.status(500).json(Response.error(500, "Most booked venues report failed"));
    }
};

// Peak Booking Hours Analytics
const getPeakBookingHours = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                HOUR(start_datetime) AS hour,
                COUNT(*) AS bookings
            FROM bookings
            GROUP BY hour
            ORDER BY bookings DESC
        `);
        res.json(Response.success(200, "Peak booking hours report fetched successfully", rows));
    } catch (err) {
        console.error('Peak booking hours report error:', err);
        res.status(500).json(Response.error(500, "Peak booking hours report failed"));
    }
};

// Top Users by Bookings Analytics
const getTopUsersByBookings = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                u.first_name,
                u.last_name,
                COUNT(b.booking_id) AS total_bookings
            FROM users u
            JOIN bookings b ON u.user_id = b.user_id
            GROUP BY u.user_id
            ORDER BY total_bookings DESC LIMIT 5
        `);
        res.json(Response.success(200, "Top users by bookings report fetched successfully", rows));
    } catch (err) {
        console.error('Top users by bookings report error:', err);
        res.status(500).json(Response.error(500, "Top users by bookings report failed"));
    }
};

// Most Liked Posts Analytics
const getMostLikedPosts = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                p.post_id,
                u.first_name,
                u.last_name,
                p.text_content,
                p.media_url,
                p.created_at,
                COUNT(pl.user_id) AS likes
            FROM posts p
            JOIN users u ON p.user_id = u.user_id
            LEFT JOIN post_likes pl ON p.post_id = pl.post_id
            GROUP BY p.post_id
            ORDER BY likes DESC
            LIMIT 5
        `);
        res.json(Response.success(200, "Most liked posts report fetched successfully", rows));
    } catch (err) {
        console.error('Most liked posts report error:', err);
        res.status(500).json(Response.error(500, "Most liked posts report failed"));
    }
};

// Top Content Creators Analytics
const getTopContentCreators = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                u.first_name,
                u.last_name,
                COUNT(p.post_id) AS posts_count
            FROM users u
            JOIN posts p ON u.user_id = p.user_id
            GROUP BY u.user_id
            ORDER BY posts_count DESC LIMIT 5
        `);
        res.json(Response.success(200, "Top content creators report fetched successfully", rows));
    } catch (err) {
        console.error('Top content creators report error:', err);
        res.status(500).json(Response.error(500, "Top content creators report failed"));
    }
};

const getVenues = async (req, res) => {
    const connection = await db.getConnection();
    try {
        connection.beginTransaction();
        const venues = await Venue.getAllVenues(connection);
        res.status(200).json(Response.success(200, "Venues fetched successfully", venues));
    } catch (err) {
        console.error('Error fetching venues:', err);
        res.status(500).json(Response.error(500, "Failed to fetch venues"));
    }finally{
        connection.release();
    }
}

const deleteVenue = async (req, res) => {
    try {
        const { venue_id } = req.params;
        
        const exist = await Venue.findById(venue_id);
        if (!exist) {
            return res.status(404).json(Response.error(404, "Venue not found"));
        }
        
        const result = await Venue.deleteById(venue_id);

        res.status(200).json(Response.success(200, "Venue deleted successfully"));
    } catch (err) {
        console.error('Error deleting venue:', err);
        res.status(500).json(Response.error(500, "Failed to delete venue"));
    }
};

const getAllPosts = async (req, res) => {
    const connection = await db.getConnection();
    try {
        connection.beginTransaction();
        const posts = await Post.getAllPosts(connection);
        res.status(200).json(Response.success(200, "Posts fetched successfully", posts));
    }catch(err){
        console.error('Error fetching posts:', err);
        res.status(500).json(Response.error(500, "Failed to fetch posts"));
    }finally{
        connection.release();
    }   
};

const deletePost = async (req, res) => {
    const connection = await db.getConnection();
    try {
        
        connection.beginTransaction();
        const { post_id } = req.params;
        const exist = await Post.findById(post_id, connection);

        if (!exist) {
            return res.status(404).json(Response.error(404, "Post not found"));
        }

        const result = await Post.deleteById(post_id, connection);

        await connection.commit();
        res.status(200).json(Response.success(200, "Post deleted successfully"));

    } catch (err) {
        console.error('Error deleting post:', err);
        res.status(500).json(Response.error(500, "Failed to delete post"));
    }finally{
        connection.release();
    }
}

export { 
    adminLogin, 
    getAllSports, 
    addSport, 
    updateSport, 
    deleteSport, 
    getDashboardStats, 
    getSportMetrics, 
    getRecentActivities, 
    getBookingReport, 
    getRevenueReport, 
    getUserReport, 
    getBookingMetrics, 
    getAllUsers, 
    deleteUser,
    // New Analytics Functions
    getUserGrowthReport,
    getVenueGrowthReport,
    getBookingTrendReport,
    getMonthlyRevenueReport,
    getRevenueByVenue,
    getRevenueBySport,
    getMostPlayedSports,
    getMostBookedVenues,
    getPeakBookingHours,
    getTopUsersByBookings,
    getMostLikedPosts,
    getTopContentCreators,
    getVenues,
    deleteVenue,
    getAllPosts,
    deletePost
};