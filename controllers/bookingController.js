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

        // Check if slot is already booked for the given time
        const existingBooking = await Booking.findOne({
            slot_id,
            venue_id,
            start_datetime,
            end_datetime
        }, connection);

        if (existingBooking) {
            if (transactionStarted) await connection.rollback();
            return res.status(409).json(Response.error(409, "Slot is already booked for the selected time"));
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

const allCreatedGames = async (req, res) => {
    const connection = await db.getConnection();
    try {

        const query = `
        select 
        s.sport_name,
        v.venue_name,
        v.address,
        (
            SELECT COUNT(*)
            FROM game_players gp
            WHERE gp.game_id = g.game_id
        ) AS total_joined_player
        from games g
        left join sports as s on s.sport_id = g.sport_id
        left join venues as v on v.venue_id = g.venue_id`

        const [rows] = await connection.query(query);

        res.status(200).json(Response.success(200, "Games fetched successfully", rows));

    } catch (error) {
        await connection.release();
        console.error('Error fetching games:', error);
        res.status(500).json(Response.error(500, "Internal server error"));
    } finally {
        await connection.release();
    }
}

const userJoinedGames = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const userId = req.user?.[0]?.user_id || req.params.userId || req.body.user_id;

        if (!userId) {
            await connection.release();
            return res.status(400).json(Response.error(400, "user_id is required"));
        }

        const query = `
SELECT 
    g.game_id,
    g.start_datetime,
    g.end_datetime,
    g.price_per_hour,
    g.status AS game_status,
    g.created_at,

    s.sport_name,
    v.venue_name,
    v.address AS venue_location,

    gp_self.status AS my_status,

    COUNT(gp_all.user_id) AS total_players
FROM game_players gp_self
JOIN games g
    ON gp_self.game_id = g.game_id
JOIN sports s
    ON g.sport_id = s.sport_id
JOIN venues v
    ON g.venue_id = v.venue_id

LEFT JOIN game_players gp_all
    ON g.game_id = gp_all.game_id
   AND gp_all.status = 'Approved'

WHERE gp_self.user_id = ?
GROUP BY
    g.game_id,
    g.start_datetime,
    g.end_datetime,
    g.price_per_hour,
    g.status,
    g.created_at,
    s.sport_name,
    v.venue_name,
    v.address,
    gp_self.status
ORDER BY g.start_datetime DESC;
        `;

        const [rows] = await connection.query(query, [userId]);

        res.status(200).json(Response.success(200, "User joined games fetched successfully", rows));
    } catch (error) {
        console.error('Error fetching user joined games:', error);
        res.status(500).json(Response.error(500, "Internal server error"));
    } finally {
        await connection.release();
    }
}

const userGamesCreated = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const userId = req.user?.[0]?.user_id || req.params.userId || req.body.user_id;

        if (!userId) {
            await connection.release();
            return res.status(400).json(Response.error(400, "user_id is required"));
        }

        const query = `use playmate2;

SELECT 
    g.game_id,
    g.start_datetime,
    g.end_datetime,
    g.price_per_hour,
    g.status AS game_status,
    g.created_at,

    s.sport_name,

    v.venue_name,
    v.address AS venue_location,

    COUNT(gp.user_id) AS total_players
FROM games g
JOIN sports s
    ON g.sport_id = s.sport_id
JOIN venues v
    ON g.venue_id = v.venue_id

-- count ONLY approved players
LEFT JOIN game_players gp
    ON g.game_id = gp.game_id
   AND gp.status = 'Approved'

WHERE g.host_user_id =  20
GROUP BY
    g.game_id,
    g.start_datetime,
    g.end_datetime,
    g.price_per_hour,
    g.status,
    g.created_at,
    s.sport_name,
    v.venue_name,
    v.address
ORDER BY g.created_at DESC;
        `;

        const [rows] = await connection.query(query, [userId]);

        res.status(200).json(Response.success(200, "User created games fetched successfully", rows));
    } catch (error) {
        console.error('Error fetching user created games:', error);
        res.status(500).json(Response.error(500, "Internal server error"));
    } finally {
        await connection.release();
    }
}

export default {
    venueBooking,
    allCreatedGames,
    userJoinedGames,
    userGamesCreated
};
