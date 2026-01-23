import e from "express";
import db from "../config/db.js";
import Slot from "../models/Slot.js";
import Response from "../utils/Response.js";

Slot.createTable().catch(console.error);

const getAllSlotsOfVenue = async (req, res) => {
    const connection = await db.getConnection();
    try {
        connection.beginTransaction();
        const { venueId } = req.params;
        const slots = await Slot.getSlotsByVenueId(venueId, connection);
        await connection.commit();
        res.status(200).json(Response.success(200, "Slots fetched successfully", slots));
    } catch (error) {
        await connection.rollback();
        console.error('Error fetching slots for venue:', error);
        res.status(500).json(Response.error(500, "Internal server error"));
    } finally {
        connection.release();
    }
};

const deleteSlot = async (req, res) => {
    const connection = await db.getConnection();
    try {
        connection.beginTransaction();
        const { slotId } = req.params;
        const deleted = await Slot.deleteById(slotId, connection);
        if (deleted) {
            await connection.commit();
            res.status(200).json(Response.success(200, "Slot deleted successfully"));
        }
        else {
            await connection.rollback();
            res.status(404).json(Response.error(404, "Slot not found"));
        }
    } catch (error) {
        await connection.rollback();
        console.error('Error deleting slot:', error);
        res.status(500).json(Response.error(500, "Internal server error"));
    } finally {
        connection.release();
    }
};

const editSlot = async (req, res) => {
    const connection = await db.getConnection();
    try {
        connection.beginTransaction();
        const { slotId } = req.params;
        const { venue_sport_id, start_time, end_time, price_per_slot } = req.body;
        const updated = await Slot.updateSlot(slotId, { venue_sport_id, start_time, end_time, price_per_slot }, connection);
        if (updated) {
            await connection.commit();
            res.status(200).json(Response.success(200, "Slot updated successfully"));
        } else {
            await connection.rollback();
            res.status(404).json(Response.error(404, "Slot not found"));
        }
    } catch (error) {
        await connection.rollback();
        console.error('Error updating slot:', error);
        res.status(500).json(Response.error(500, "Internal server error"));
    } finally {
        connection.release();
    }
};

const addNewSlot = async (req, res) => {
    const connection = await db.getConnection();
    try {
        connection.beginTransaction();
        const { venue_sport_id, start_time, end_time, price_per_slot } = req.body;
        const newSlot = await Slot.save({ venue_sport_id, start_time, end_time, price_per_slot }, connection);
        await connection.commit();
        res.status(201).json(Response.success(201, "Slot created successfully", newSlot));
    } catch (error) {
        await connection.rollback();
        console.error('Error creating new slot:', error);
        res.status(500).json(Response.error(500, "Internal server error"));
    } finally {
        connection.release();
    }
};

export { getAllSlotsOfVenue, deleteSlot, editSlot, addNewSlot };