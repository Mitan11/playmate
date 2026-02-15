import db from "../config/db.js";
import Sport from "../models/Sport.js";
import User from "../models/User.js";
import Venue from "../models/Venue.js";
import VenueSport from "../models/VenueSport.js";
import Slot from "../models/Slot.js";
import Games from "../models/Games.js";
import Booking from "../models/Booking.js";
import Post from "../models/Post.js";
import UserSport from "../models/UserSport.js";
import VenueImages from "../models/VenueImages.js";
import GamePlayer from "../models/game_player.js";

const run = async () => {
    try {
        await Sport.createTable();
        await User.createTable();
        await Venue.createTable();
        await VenueSport.createTable();
        await Slot.createTable();
        await Games.createTable();
        await Booking.createTable();
        await Post.createTable();
        await UserSport.createTable();
        await VenueImages.createTable();
        await GamePlayer.createTable();
        console.log("All tables ensured");
        await db.end();
        process.exit(0);
    } catch (err) {
        console.error("Table initialization failed:", err);
        await db.end();
        process.exit(1);
    }
};

run();
