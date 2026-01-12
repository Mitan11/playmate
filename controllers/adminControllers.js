import db from "../config/db.js";
import Sport from "../models/Sport.js";
import capitalizeFirstLetter from "../utils/capitalize.js";
import Response from "../utils/Response.js";

Sport.createTable().catch(console.error);

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

export { getAllSports, addSport };