import os from "os";
import db from "../config/db.js";
import Response from "../utils/Response.js";
import Sport from "../models/Sport.js";

Sport.createTable().catch(console.error);

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
        message: "Sports API is healthy",
        data: {
            service: "sports-api",
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

const addNewSport = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const { sport_name } = req.body;

        // Validation
        if (!sport_name) {
            await connection.rollback();
            return res.status(400).json(Response.error(400, "Sport name is required"));
        }

        // Trim and validate sport name
        const trimmedSportName = sport_name.trim();

        if (trimmedSportName.length === 0) {
            await connection.rollback();
            return res.status(400).json(Response.error(400, "Sport name cannot be empty"));
        }

        if (trimmedSportName.length > 100) {
            await connection.rollback();
            return res.status(400).json(Response.error(400, "Sport name must be 100 characters or less"));
        }

        // Check if sport already exists
        const existingSport = await Sport.findByName(trimmedSportName, connection);
        if (existingSport) {
            await connection.rollback();
            return res.status(409).json(
                Response.error(409, "Sport already exists", {
                    sport_id: existingSport.sport_id,
                    sport_name: existingSport.sport_name
                })
            );
        }

        // Insert new sport into the database
        const sport = await Sport.addSport(trimmedSportName, connection);

        await connection.commit();
        res.status(201).json(
            Response.success(201, "New sport added successfully", {
                sport_id: sport.sport_id,
                sport_name: sport.sport_name,
                created_at: sport.created_at
            })
        );

    } catch (error) {
        await connection.rollback();
        console.error("Error adding new sport:", error);

        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        connection.release();
    }
};

const getAllSports = async (req, res) => {
    const connection = await db.getConnection();

    try {
        const sports = await Sport.getAllSports(connection);

        connection.commit();
        res.status(200).json(
            Response.success(200, "Sports retrieved successfully", {
                count: sports.length,
                sports: sports.map(sport => ({
                    sport_id: sport.sport_id,
                    sport_name: sport.sport_name,
                    created_at: sport.created_at
                }))
            })
        );
    } catch (error) {
        await connection.rollback();
        console.error("Error fetching sports:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        connection.release();
    }
};

const updateSport = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const { sportId } = req.params;
        const { sport_name } = req.body;

        if (!sportId || isNaN(sportId)) {
            await connection.rollback();
            return res.status(400).json(Response.error(400, "Invalid sport ID"));
        }

        if (!sport_name) {
            await connection.rollback();
            return res.status(400).json(Response.error(400, "Sport name is required"));
        }

        const trimmedSportName = sport_name.trim();

        if (trimmedSportName.length === 0) {
            await connection.rollback();
            return res.status(400).json(Response.error(400, "Sport name cannot be empty"));
        }

        if (trimmedSportName.length > 100) {
            await connection.rollback();
            return res.status(400).json(Response.error(400, "Sport name must be 100 characters or less"));
        }

        const updatedSport = await Sport.updateSport(parseInt(sportId), trimmedSportName, connection);

        if (!updatedSport) {
            await connection.rollback();
            return res.status(404).json(Response.error(404, "Sport not found"));
        }

        await connection.commit();
        res.status(200).json(
            Response.success(200, "Sport updated successfully", {
                sport_id: updatedSport.sport_id,
                sport_name: updatedSport.sport_name,
                created_at: updatedSport.created_at
            })
        );
    } catch (error) {
        await connection.rollback();
        console.error("Error updating sport:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        connection.release();
    }
};

const deleteSport = async (req, res) => {
    const connection = await db.getConnection();

    try {
        const { sportId } = req.params;

        if (!sportId || isNaN(sportId)) {
            await connection.rollback();
            return res.status(400).json(Response.error(400, "Invalid sport ID"));
        }

        const deleted = await Sport.deleteSport(parseInt(sportId), connection);

        if (!deleted) {
            await connection.rollback();
            return res.status(404).json(Response.error(404, "Sport not found"));
        }

        await connection.commit();
        res.status(200).json(
            Response.success(200, "Sport deleted successfully", {
                sport_id: parseInt(sportId)
            })
        );
    } catch (error) {
        await connection.rollback();
        console.error("Error deleting sport:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        connection.release();
    }
};

export {
    healthCheck,
    addNewSport,
    getAllSports,
    updateSport,
    deleteSport
};