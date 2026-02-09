import db from "../config/db.js";
import Booking from "../models/Booking.js";
import Games from "../models/Games.js";
import Sport from "../models/Sport.js";
import VenueSport from "../models/VenueSport.js";
import Response from "../utils/Response.js";

const venueBooking = async (req, res) => {
    let connection;
    let transactionStarted = false;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();
        transactionStarted = true;
        const { sport_id, venue_id, start_datetime, end_datetime, host_id, price, slot_id } = req.body;

        if (!sport_id || !venue_id || !start_datetime || !end_datetime || !host_id || !price || !slot_id) {
            if (transactionStarted) await connection.rollback();
            return res.status(400).json(Response.error(400, "Missing required fields"));
        }

        const gameData = {
            sport_id,
            venue_id,
            start_datetime,
            end_datetime,
            host_user_id: host_id,
            price_per_hour: price
        };

        const game = await Games.save(gameData, connection);
        const sport = await Sport.findById(sport_id, connection);
        const venue_sport_id = await VenueSport.getSportByvalue(sport.sport_name, connection);

        if (!venue_sport_id || !slot_id || !game?.game_id) {
            if (transactionStarted) await connection.rollback();
            return res.status(400).json(Response.error(400, "Sport not available at this venue"));
        }

        const bookingData = {
            slot_id,
            venue_id,
            venue_sport_id,
            user_id: host_id,
            game_id: game.game_id,
            start_datetime,
            end_datetime,
            total_price: price
        };

        const booking = await Booking.save(bookingData, connection);

        await connection.commit();

        return res.status(200).json(
            Response.success(200, "Booking successful", {
                booking,
                game,
            })
        );
    } catch (error) {
        if (connection && transactionStarted) {
            try { await connection.rollback(); } catch (e) { /* ignore */ }
        }
        console.error('Error processing booking:', error);
        res.status(500).json(Response.error(500, "Internal server error"));
    } finally {
        if (connection) connection.release();
    }
};

export default venueBooking;
