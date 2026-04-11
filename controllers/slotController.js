import db from "../config/db.js";
import Slot from "../models/Slot.js";
import Response from "../utils/Response.js";
import axios from "axios";

const getAvailableSlotsByVenueAndDate = async (req, res) => {
    const connection = await db.getConnection();
    try {
        connection.beginTransaction();
        const { venueId } = req.params;
        let { date, sportId } = req.query;
        const userId = Number(req.user?.user_id ?? req.body?.userId);
        date = date ? new Date(date) : null;

        if (!venueId || isNaN(venueId)) {
            await connection.rollback();
            return res.status(400).json(Response.error(400, "Invalid venue ID"));
        }

        if (!date) {
            await connection.rollback();
            return res.status(400).json(Response.error(400, "date is required (YYYY-MM-DD)"));
        }

        if (Number.isNaN(userId)) {
            await connection.rollback();
            return res.status(400).json(Response.error(400, "user_id is required and must be a number"));
        }

        const formattedDate = date.toISOString().split('T')[0];
        const recommendationUrl = `http://localhost:8080/api/recommendations/slots/${venueId}`;

        let resData = null;
        try {
            const response = await axios.post(
                recommendationUrl,
                { user_id: userId },
                {
                    params: {
                        date: formattedDate,
                        sportId
                    }
                }
            );
            resData = response.data;
        } catch (error) {
            console.log(error);
            console.error('Error fetching bookings:', error.message);
        }

        const rows = await Slot.getAvailableSlotsByVenueAndDate(venueId, date, sportId, connection);

        const recommendedSlots = Array.isArray(resData?.recommended_slots) ? resData.recommended_slots : [];
        const recommendationMeta = resData?.meta ?? null;

        const recommendationMap = new Map(
            recommendedSlots.map((recommendedSlot) => [Number(recommendedSlot.slot_id), recommendedSlot])
        );

        const mergedSlots = rows.map((slot) => {
            const slotId = Number(slot.slot_id ?? slot.id);
            const recommendation = recommendationMap.get(slotId);

            return {
                ...slot,
                is_recommended: Boolean(recommendation),
                recommendation: recommendation
                    ? {
                        score: recommendation.score,
                        reason: recommendation.reason
                    }
                    : null
            };
        });

        const mergedResponse = {
            available_slots: rows,
            merged_slots: mergedSlots,
            recommended_slots: recommendedSlots,
            meta: recommendationMeta
        };

        await connection.commit();
        console.log("Merged Response:", mergedResponse);
        res.status(200).json(Response.success(200, "Available slots fetched successfully", mergedResponse));
    } catch (error) {
        await connection.rollback();
        console.error("Error fetching available slots:", error);
        res.status(500).json(Response.error(500, "Internal server error"));
    } finally {
        connection.release();
    }
};

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

export { getAllSlotsOfVenue, deleteSlot, editSlot, addNewSlot, getAvailableSlotsByVenueAndDate };