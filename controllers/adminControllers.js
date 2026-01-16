import db from "../config/db.js";
import Sport from "../models/Sport.js";
import capitalizeFirstLetter from "../utils/capitalize.js";
import Response from "../utils/Response.js";
import AuthHelpers from "../utils/AuthHelpers.js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import User from "../models/User.js";
dayjs.extend(relativeTime);

Sport.createTable().catch(console.error);

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

        await connection.commit();
        res.status(200).json(
            Response.success(200, "Dashboard stats fetched successfully", {
                totalSports: sports.totalSports,
                activeSessions: sessions.activeSessions,
                totalUsers: users.totalUsers,
                totalRevenue: revenue.revenue
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

export { adminLogin, getAllSports, addSport, updateSport, deleteSport, getDashboardStats, getSportMetrics, getRecentActivities, getBookingReport, getRevenueReport, getUserReport, getBookingMetrics, getAllUsers, deleteUser };