import express from "express";
import { adminVerifyToken } from "../middleware/authUser.js";
import { addSport, adminLogin, deleteSport, getAllSports, updateSport } from "../controllers/adminControllers.js";

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

adminRouter.patch('/updateSport/:sport_id', adminVerifyToken, (req, res) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'Update sport details by sport ID'
    updateSport(req, res);
});

adminRouter.delete('/deleteSport/:sport_id', adminVerifyToken, (req, res) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'Delete sport by sport ID'
    deleteSport(req, res);
});

export default adminRouter;