import express from "express";
import { adminVerifyToken } from "../middleware/authUser.js";
import { addSport, adminLogin, getAllSports } from "../controllers/adminControllers.js";

const adminRouter = express.Router();

adminRouter.post('/admin-login', (req, res) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'Admin login'
    adminLogin(req, res);
});

adminRouter.get('/getAllSports', adminVerifyToken, (req, res) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'Get all sports'
    getAllSports(req, res);    
});

adminRouter.post('/addSport', adminVerifyToken, (req, res) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'Add a new sport'
    addSport(req, res);
});

export default adminRouter;