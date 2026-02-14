import express from "express";
import 'dotenv/config';
import cors from "cors";

import path from "path";
import { fileURLToPath } from "url";

import db from "./config/db.js";
import response from "./utils/Response.js";
import authRouter from "./routes/authRouter.js";
import connectCloudinary from "./utils/Cloudinary.js";
import sportRouter from "./routes/sportRouter.js";
import swaggerDocument from "./swagger-output.json" with { type: "json" };
import venueRouter from "./routes/venueRouter.js";
import adminRouter from "./routes/adminRouter.js";
import Sport from "./models/Sport.js";
import User from "./models/User.js";
import Venue from "./models/Venue.js";
import VenueSport from "./models/VenueSport.js";
import Slot from "./models/Slot.js";
import Games from "./models/Games.js";
import Booking from "./models/Booking.js";
import Post from "./models/Post.js";
import UserSport from "./models/UserSport.js";
import VenueImages from "./models/VenueImages.js";
import userRouter from "./routes/userRouter.js";
import GamePlayer from "./models/game_player.js";

// Ensure tables exist in dependency-safe order to satisfy foreign keys
const tablesReady = (async () => {
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
    } catch (err) {
        console.error("Table initialization failed:", err);
    }
})();

class App {
    constructor() {
        this.app = express();
        this.PORT = process.env.PORT || 3000;

        this.initializeMiddlewares();
        this.initializeRoutes();
        connectCloudinary();
    }

    initializeMiddlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        this.app.use(
            cors({
                origin: "*",
                credentials: true,
                methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
                allowedHeaders: ["Content-Type", "Authorization"],
            })
        );
    }

    initializeRoutes() {
        this.app.get("/", (req, res) => {
            res.status(200).json(response.success(200, "API is working"));
        });

        this.app.use("/api/v1/auth", authRouter);
        this.app.use("/api/v1/sports", sportRouter);
        this.app.use("/api/v1/user", userRouter);
        this.app.use("/api/v1/venue", venueRouter);
        this.app.use("/api/v1/admin", adminRouter);

        // Swagger JSON endpoint
        this.app.get("/api-docs/swagger.json", (req, res) => {
            res.json(swaggerDocument);
        });

        // Swagger UI from file
        this.app.get("/api-docs", (req, res) => {
            const __dirname = path.dirname(fileURLToPath(import.meta.url));
            res.sendFile(path.join(__dirname, 'views', 'apiDoc.html'));
        });
    }

    async startLocalServer() {
        try {
            await db.getConnection();
            console.log("Database connection successful on startup");

            // Wait for table creation before accepting traffic
            await tablesReady;

            this.app.listen(this.PORT, "0.0.0.0", () => {
                console.log(`Local server running → http://localhost:${this.PORT}`);
            });
        } catch (error) {
            console.error("Database connection failed on startup:", error);
        }
    }
}

const application = new App();

/*  
---------------------------------------------
 RUN LOCALLY ONLY
 On Vercel, serverless functions DO NOT use
 app.listen(), so we skip it.
---------------------------------------------
*/
if (!process.env.VERCEL) {
    application.startLocalServer();
}

/*
---------------------------------------------
 EXPORT EXPRESS APP FOR VERCEL
---------------------------------------------
*/
export default application.app;
