import express from "express";
import 'dotenv/config';
import cors from "cors";

import db from "./config/db.js";
import response from "./utils/Response.js";
import authRouter from "./routes/authRouter.js";
import connectCloudinary from "./utils/Cloudinary.js";
import sportRouter from "./routes/sportRouter.js";
import userSportRouter from "./routes/userRouter.js";

class App {
    constructor() {
        // app config
        this.app = express();
        this.PORT = process.env.PORT || 3000;

        this.initializeMiddlewares();
        this.initializeRoutes();
        connectCloudinary();
    }

    initializeMiddlewares() {
        // middleware
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        // Replace permissive CORS with a specific origin and credentials support
        this.app.use(cors({
            origin: process.env.CLIENT_URL || 'http://localhost:3000', // set your frontend URL
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));
    }

    initializeRoutes() {
        // Testing API
        this.app.get('/', (req, res) => {
            res.status(200).json(response.success(200, "Api is working"));
        })
        this.app.use('/api/v1/auth', authRouter);
        this.app.use('/api/v1/sports', sportRouter);
        this.app.use('/api/v1/user', userSportRouter);

    }

    listen() {
        // DB connection and server listener
        db.getConnection().then(() => {
            console.log('Database connection successful on startup');
            this.app.listen(this.PORT,"0.0.0.0", async () => {
                console.log(`Server is running on port http://localhost:${this.PORT}`);
            })
        }).catch((error) => {
            console.error('Database connection failed on startup:', error);
        });
    }

}

// Start the application
const app = new App();
app.listen();