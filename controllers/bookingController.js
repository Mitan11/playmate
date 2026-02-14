import db from "../config/db.js";
import Booking from "../models/Booking.js";
import Games from "../models/Games.js";
import Sport from "../models/Sport.js";
import User from "../models/User.js";
import Venue from "../models/Venue.js";
import VenueSport from "../models/VenueSport.js";
import Response from "../utils/Response.js";
import { sendEmail } from "../utils/Mail.js";
import { bookingReceiptTemplate } from "../utils/emailTemplates.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const getRazorpayClient = () => {
    const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
        throw new Error("Razorpay keys are not configured");
    }
    return new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });
};

const verifyRazorpaySignature = (orderId, paymentId, signature) => {
    const { RAZORPAY_KEY_SECRET } = process.env;
    const body = `${orderId}|${paymentId}`;
    const expected = crypto
        .createHmac("sha256", RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");
    return expected === signature;
};

const createPaymentOrder = async (req, res) => {
    try {
        const { amount, currency = "INR", receipt } = req.body;
        if (!amount || Number.isNaN(Number(amount)) || Number(amount) <= 0) {
            return res.status(400).json(Response.error(400, "Valid amount is required"));
        }

        const razorpay = getRazorpayClient();
        const order = await razorpay.orders.create({
            amount: Math.round(Number(amount) * 100),
            currency,
            receipt
        });

        return res.status(200).json(Response.success(200, "Order created", {
            order_id: order.id,
            amount: order.amount,
            currency: order.currency
        }));
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        return res.status(500).json(Response.error(500, "Unable to create payment order"));
    }
};

const venueBooking = async (req, res) => {
    let connection;
    let transactionStarted = false;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();
        transactionStarted = true;
        const { sport_id, venue_id, start_datetime, end_datetime, host_id, price, payment } = req.body;
        const slotId = Number(req.body?.slot_id ?? req.body?.slotId);

        if (!sport_id || !venue_id || !start_datetime || !end_datetime || !host_id || !price || !Number.isFinite(slotId) || slotId <= 0) {
            if (transactionStarted) await connection.rollback();
            return res.status(400).json(Response.error(400, "Missing required fields"));
        }

        const paymentOrderId = payment?.razorpay_order_id;
        const paymentId = payment?.razorpay_payment_id;
        const paymentSignature = payment?.razorpay_signature;
        const amount = Number(payment?.amount);

        let paymentStatus = "unpaid";
        const hasPaymentDetails = paymentOrderId && paymentId && paymentSignature && Number.isFinite(amount) && amount > 0;
        if (hasPaymentDetails) {
            if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
                if (transactionStarted) await connection.rollback();
                return res.status(500).json(Response.error(500, "Payment gateway is not configured"));
            }

            const isPaymentValid = verifyRazorpaySignature(paymentOrderId, paymentId, paymentSignature);
            if (!isPaymentValid) {
                if (transactionStarted) await connection.rollback();
                return res.status(400).json(Response.error(400, "Invalid payment signature"));
            }
            paymentStatus = "paid";
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

        if (!venue_sport_id || !slotId || !game?.game_id) {
            if (transactionStarted) await connection.rollback();
            return res.status(400).json(Response.error(400, "Sport not available at this venue"));
        }

        // Check if slot is already booked for the given time
        const existingBooking = await Booking.findOne({
            slot_id: slotId,
            venue_id,
            start_datetime,
            end_datetime
        }, connection);

        if (existingBooking) {
            if (transactionStarted) await connection.rollback();
            return res.status(409).json(Response.error(409, "Slot is already booked for the selected time"));
        }

        const bookingData = {
            slot_id: slotId,
            venue_id,
            venue_sport_id,
            user_id: host_id,
            game_id: game.game_id,
            start_datetime,
            end_datetime,
            total_price: price,
            payment: paymentStatus
        };

        const booking = await Booking.save(bookingData, connection);

        await connection.commit();

        if (paymentStatus === "paid") {
            try {
                const userRows = await User.findById(host_id, connection);
                const user = userRows?.[0];
                const venue = await Venue.findById(venue_id, connection);
                const totalPrice = Number.isFinite(Number(amount))
                    ? Number(amount).toFixed(2)
                    : amount;

                if (user?.user_email) {
                    const subject = `Playmate Receipt - Booking #${booking.booking_id}`;
                    const html = bookingReceiptTemplate({
                        name: `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Player",
                        bookingId: booking.booking_id,
                        venueName: venue?.venue_name || "Venue",
                        venueAddress: venue?.address || "-",
                        sportName: sport?.sport_name || "-",
                        startDateTime: start_datetime,
                        endDateTime: end_datetime,
                        totalPrice,
                        paymentStatus,
                        orderId: paymentOrderId,
                        paymentId: paymentId
                    });
                    await sendEmail(user.user_email, subject, html);
                }
            } catch (emailError) {
                console.error("Receipt email failed:", emailError);
            }
        }

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
        if (error?.code === "ER_DUP_ENTRY") {
            return res.status(409).json(Response.error(409, "Slot is already booked for the selected time"));
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
        const userId = req.user?.[0]?.user_id || req.params.userId || req.body.user_id;
        if (!userId) {
            return res.status(400).json(Response.error(400, "user_id is required"));
        }
        const query = `
        select 
        g.game_id,
        gp.status,
        s.sport_name,
        v.venue_name,
        v.address,
        u.first_name,
        u.last_name,
        u.profile_image,
        g.created_at,
        (
            SELECT COUNT(*)
            FROM game_players gp
            WHERE gp.game_id = g.game_id
        ) AS total_joined_player
        from games g
        left join sports as s on s.sport_id = g.sport_id
        left join venues as v on v.venue_id = g.venue_id
        left join users as u on u.user_id = g.host_user_id
        left join game_players as gp on gp.game_id = g.game_id and gp.user_id = ?

        where u.user_id != ? 
        and (gp.status IS NULL OR gp.status = 'Pending' OR gp.status = 'Rejected')
        order by g.created_at desc;
        `

        const [rows] = await connection.query(query, [userId, userId]);

        res.status(200).json(Response.success(200, "Games fetched successfully", rows));

    } catch (error) {
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

        const query = `SELECT 
    g.game_id,
    g.start_datetime,
    g.end_datetime,
    g.price_per_hour,
    g.status AS game_status,
    g.created_at,

    s.sport_name,
    v.venue_name,
    v.address AS venue_location,
    u.first_name,
    u.last_name,
    u.profile_image,
    gp_self.status AS my_status,

    COUNT(gp_all.user_id) AS total_players
FROM game_players gp_self
JOIN games g
    ON gp_self.game_id = g.game_id
JOIN sports s
    ON g.sport_id = s.sport_id
JOIN venues v
    ON g.venue_id = v.venue_id
LEFT JOIN users as u ON u.user_id = g.host_user_id
LEFT JOIN game_players gp_all
    ON g.game_id = gp_all.game_id
   AND gp_all.status = 'Approved'

WHERE gp_self.user_id = ?
  AND gp_self.status IN ('Approved')
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
    u.first_name,
    u.last_name,
    u.profile_image,
    gp_self.status
ORDER BY g.created_at DESC;
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

        const query = `
        SELECT 
    g.game_id,
    g.start_datetime,
    g.end_datetime,
    g.price_per_hour,
    
    g.created_at,
    
    u.first_name,
    u.last_name,
    u.profile_image,
    
    s.sport_name,

    v.venue_name,
    v.address AS venue_location,

    b.payment AS payment_status,
    b.booking_id,
    b.total_price,
    COUNT(gp.user_id) AS total_players
FROM games g
JOIN sports s
    ON g.sport_id = s.sport_id
JOIN venues v
    ON g.venue_id = v.venue_id
LEFT JOIN users as u ON u.user_id = g.host_user_id
LEFT JOIN bookings as b ON b.game_id = g.game_id
LEFT JOIN game_players gp
    ON g.game_id = gp.game_id
   AND gp.status = 'Approved'

WHERE g.host_user_id = ?
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
    u.first_name,
    u.last_name,
    u.profile_image,
    b.payment,
    b.booking_id,
    b.total_price
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

export {
    venueBooking,
    createPaymentOrder,
    allCreatedGames,
    userJoinedGames,
    userGamesCreated
};
