import express from "express";
import { adminVerifyToken } from "../middleware/authUser.js";
import { addSport, adminLogin, deleteSport, deleteUser, getAllSports, getAllUsers, getBookingMetrics, getBookingReport, getDashboardStats, getRecentActivities, getRevenueReport, getSportMetrics, getUserReport, updateSport, getUserGrowthReport, getVenueGrowthReport, getBookingTrendReport, getMonthlyRevenueReport, getRevenueByVenue, getRevenueBySport, getMostPlayedSports, getMostBookedVenues, getPeakBookingHours, getTopUsersByBookings, getMostLikedPosts, getTopContentCreators, deleteVenue, getVenues, getAllPosts, deletePost } from "../controllers/adminControllers.js";

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

adminRouter.get('/getAllUsers', (req, res) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'Get all users for dashboard'
    getAllUsers(req, res);
});

adminRouter.delete('/deleteUser/:user_id', adminVerifyToken, (req, res) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'Delete user by user ID'
    deleteUser(req, res);
});

// Advanced Analytics Routes
adminRouter.get('/analytics/user-growth', adminVerifyToken, (req, res) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'Get monthly user growth analytics'
    getUserGrowthReport(req, res);
});

adminRouter.get('/analytics/venue-growth', adminVerifyToken, (req, res) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'Get monthly venue growth analytics'
    getVenueGrowthReport(req, res);
});

adminRouter.get('/analytics/booking-trend', adminVerifyToken, (req, res) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'Get daily booking trend analytics'
    getBookingTrendReport(req, res);
});

adminRouter.get('/analytics/monthly-revenue', adminVerifyToken, (req, res) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'Get monthly revenue analytics'
    getMonthlyRevenueReport(req, res);
});

adminRouter.get('/analytics/revenue-by-venue', adminVerifyToken, (req, res) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'Get revenue breakdown by venue'
    getRevenueByVenue(req, res);
});

adminRouter.get('/analytics/revenue-by-sport', adminVerifyToken, (req, res) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'Get revenue breakdown by sport'
    getRevenueBySport(req, res);
});

adminRouter.get('/analytics/most-played-sports', adminVerifyToken, (req, res) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'Get most played sports analytics'
    getMostPlayedSports(req, res);
});

adminRouter.get('/analytics/most-booked-venues', adminVerifyToken, (req, res) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'Get most booked venues analytics'
    getMostBookedVenues(req, res);
});

adminRouter.get('/analytics/peak-booking-hours', adminVerifyToken, (req, res) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'Get peak booking hours analytics'
    getPeakBookingHours(req, res);
});

adminRouter.get('/analytics/top-users-by-bookings', adminVerifyToken, (req, res) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'Get top users by booking count'
    getTopUsersByBookings(req, res);
});

adminRouter.get('/analytics/most-liked-posts', adminVerifyToken, (req, res) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'Get most liked posts analytics'
    getMostLikedPosts(req, res);
});

adminRouter.get('/analytics/top-content-creators', adminVerifyToken, (req, res) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'Get top content creators analytics'
    getTopContentCreators(req, res);
});

adminRouter.get('/getVenues' , (req, res) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'Get all venues'
    getVenues(req, res);
});

adminRouter.delete('/deleteVenue/:venue_id', adminVerifyToken, (req, res) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'Delete venue by venue ID'
    deleteVenue(req, res);
});

adminRouter.get('/getAllPosts', adminVerifyToken, (req, res) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'Get all posts'
    getAllPosts(req, res);
});

adminRouter.delete('/deletePost/:post_id', adminVerifyToken, (req, res) => {
    // #swagger.tags = ['Admin']
    // #swagger.description = 'Delete post by post ID'
    deletePost(req, res);
});

export default adminRouter;