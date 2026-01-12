import db from "../config/db.js";
import Sport from "../models/Sport.js";
import capitalizeFirstLetter from "../utils/capitalize.js";
import Response from "../utils/Response.js";
import AuthHelpers from "../utils/AuthHelpers.js";

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

export { adminLogin, getAllSports, addSport };