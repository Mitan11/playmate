import express from 'express';
import { 
    getVenueDashboardStats, 
    registerVenue, 
    updateVenueProfile, 
    venueLogin, 
    venueProfile,
    getDailyBookingTrend,
    getMonthlyRevenueTrend,
    getRevenueBySport,
    getRevenueBySlot,
    getMostBookedSlots,
    getPeakBookingHours,
    getSlotUsageFrequency,
    getUnusedSlots,
    getUniqueCustomers,
    getRepeatCustomers,
    getTopCustomers,
    getTotalGamesHosted,
    getGamesBySport,
    getRecentBookings
} from '../controllers/venueController.js';
import { venueVerifyToken } from '../middleware/authUser.js';
import upload from '../middleware/multer.js';

const venueRouter = express.Router();

// register venue
venueRouter.post('/register', (req, res) => {
    // #swagger.tags = ['Venue']
    // #swagger.description = 'Register a new venue'
    registerVenue(req, res);
});

venueRouter.post('/login', (req, res) => {
    // #swagger.tags = ['Venue']
    // #swagger.description = 'Venue login'
    venueLogin(req, res);
});

venueRouter.get('/profile/:venueId', venueVerifyToken, (req, res) => {
    // #swagger.tags = ['Venue']
    // #swagger.description = 'Get venue profile by ID'
    venueProfile(req, res);
});

venueRouter.put('/profile/:venueId', venueVerifyToken, upload.single('profile_image'), (req, res) => {
    // #swagger.tags = ['Venue']
    // #swagger.description = 'Update venue profile by ID'
    updateVenueProfile(req, res);
});

venueRouter.get('/dashboard/stats/:venueId', venueVerifyToken, (req, res) => {
    // #swagger.tags = ['Venue']
    // #swagger.description = 'Get venue dashboard statistics'
    getVenueDashboardStats(req, res);
});

// Analytics Routes
venueRouter.get('/analytics/daily-booking-trend/:venueId', venueVerifyToken, (req, res) => {
    // #swagger.tags = ['Venue Analytics']
    // #swagger.description = 'Get daily booking trend for venue'
    getDailyBookingTrend(req, res);
});

venueRouter.get('/analytics/monthly-revenue-trend/:venueId', venueVerifyToken, (req, res) => {
    // #swagger.tags = ['Venue Analytics']
    // #swagger.description = 'Get monthly revenue trend for venue'
    getMonthlyRevenueTrend(req, res);
});

venueRouter.get('/analytics/revenue-by-sport/:venueId', venueVerifyToken, (req, res) => {
    // #swagger.tags = ['Venue Analytics']
    // #swagger.description = 'Get revenue breakdown by sport for venue'
    getRevenueBySport(req, res);
});

venueRouter.get('/analytics/revenue-by-slot/:venueId', venueVerifyToken, (req, res) => {
    // #swagger.tags = ['Venue Analytics']
    // #swagger.description = 'Get revenue breakdown by slot for venue'
    getRevenueBySlot(req, res);
});

venueRouter.get('/analytics/most-booked-slots/:venueId', venueVerifyToken, (req, res) => {
    // #swagger.tags = ['Venue Analytics']
    // #swagger.description = 'Get most booked slots for venue'
    getMostBookedSlots(req, res);
});

venueRouter.get('/analytics/peak-booking-hours/:venueId', venueVerifyToken, (req, res) => {
    // #swagger.tags = ['Venue Analytics']
    // #swagger.description = 'Get peak booking hours for venue'
    getPeakBookingHours(req, res);
});

venueRouter.get('/analytics/slot-usage-frequency/:venueId', venueVerifyToken, (req, res) => {
    // #swagger.tags = ['Venue Analytics']
    // #swagger.description = 'Get slot usage frequency for venue'
    getSlotUsageFrequency(req, res);
});

venueRouter.get('/analytics/unused-slots/:venueId', venueVerifyToken, (req, res) => {
    // #swagger.tags = ['Venue Analytics']
    // #swagger.description = 'Get unused slots for venue'
    getUnusedSlots(req, res);
});

venueRouter.get('/analytics/unique-customers/:venueId', venueVerifyToken, (req, res) => {
    // #swagger.tags = ['Venue Analytics']
    // #swagger.description = 'Get unique customers count for venue'
    getUniqueCustomers(req, res);
});

venueRouter.get('/analytics/repeat-customers/:venueId', venueVerifyToken, (req, res) => {
    // #swagger.tags = ['Venue Analytics']
    // #swagger.description = 'Get repeat customers count for venue'
    getRepeatCustomers(req, res);
});

venueRouter.get('/analytics/top-customers/:venueId', venueVerifyToken, (req, res) => {
    // #swagger.tags = ['Venue Analytics']
    // #swagger.description = 'Get top customers for venue'
    getTopCustomers(req, res);
});

venueRouter.get('/analytics/total-games-hosted/:venueId', venueVerifyToken, (req, res) => {
    // #swagger.tags = ['Venue Analytics']
    // #swagger.description = 'Get total games hosted count for venue'
    getTotalGamesHosted(req, res);
});

venueRouter.get('/analytics/games-by-sport/:venueId', venueVerifyToken, (req, res) => {
    // #swagger.tags = ['Venue Analytics']
    // #swagger.description = 'Get games breakdown by sport for venue'
    getGamesBySport(req, res);
});

venueRouter.get('/analytics/recent-bookings/:venueId', venueVerifyToken, (req, res) => {
    // #swagger.tags = ['Venue Analytics']
    // #swagger.description = 'Get recent bookings for venue'
    getRecentBookings(req, res);
});

export default venueRouter;