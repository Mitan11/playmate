import express from "express";
import { adminVerifyToken } from "../middleware/authUser.js";
import { getAllSports } from "../controllers/sportController.js";

const adminRouter = express.Router();

adminRouter.get('/getAllSports', adminVerifyToken, (req, res) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'Get all sports'
    getAllSports(req, res);
});

export default adminRouter;