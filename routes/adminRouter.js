import express from "express";
import { adminVerifyToken } from "../middleware/authUser.js";
import { addSport, adminLogin, deleteSport, getAllSports, getBookingMetrics, getBookingReport, getDashboardStats, getRecentActivities, getRevenueReport, getSportMetrics, getUserReport, updateSport } from "../controllers/adminControllers.js";

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

adminRouter.get('/dashboard/stats', adminVerifyToken, (req, res) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'Get dashboard statistics'
    getDashboardStats(req, res);
});

adminRouter.get('/dashboard/sport/metrics', adminVerifyToken, (req, res) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'Get sport metrics for dashboard'
    getSportMetrics(req, res);
});

adminRouter.get('/dashboard/booking/metrics', adminVerifyToken, (req, res) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'Get booking metrics for dashboard'
    getBookingMetrics(req, res);
});

adminRouter.get('/dashboard/recent/activities', adminVerifyToken, (req, res) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'Get recent activities for dashboard'
    getRecentActivities(req, res);
});

adminRouter.get('/dashboard/booking/report', adminVerifyToken, (req, res) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'Get booking report for dashboard'
    getBookingReport(req, res);
});

adminRouter.get('/dashboard/revenue/report', adminVerifyToken, (req, res) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'Get revenue report for dashboard'
    getRevenueReport(req, res);
});

adminRouter.get('/dashboard/user/report', adminVerifyToken, (req, res) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'Get user report for dashboard'
    getUserReport(req, res);
});

export default adminRouter;