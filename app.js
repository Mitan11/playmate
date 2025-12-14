import express from "express";
import 'dotenv/config';
import cors from "cors";

import db from "./config/db.js";
import response from "./utils/Response.js";
import authRouter from "./routes/authRouter.js";
import connectCloudinary from "./utils/Cloudinary.js";
import sportRouter from "./routes/sportRouter.js";
import userSportRouter from "./routes/userRouter.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger-output.json" with { type: "json" };
import venueRouter from "./routes/venueRouter.js";

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
                origin: process.env.CLIENT_URL || "http://localhost:3000",
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
        this.app.use("/api/v1/user", userSportRouter);
        this.app.use("/api/v1/venue", venueRouter);

        this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }

    async startLocalServer() {
        try {
            await db.getConnection();
            console.log("Database connection successful on startup");

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
