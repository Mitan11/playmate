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
    getRecentBookings,
    venueSports,
    CreateVenueSport,
    deleteVenueSport,
    updateVenueSport,
    venueBookings,
    deleteBooking,
    deactiveBooking,
    paymentStatusUpdate,
    venueIamgeUpload,
    getVenueImages,
    deleteVenueImage
} from '../controllers/venueController.js';
import { venueVerifyToken } from '../middleware/authUser.js';
import upload from '../middleware/multer.js';
import { getAllSports } from '../controllers/adminControllers.js';
import { addNewSlot, deleteSlot, editSlot, getAllSlotsOfVenue } from '../controllers/slotController.js';

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

venueRouter.post('/venueImage/upload/:venueId', venueVerifyToken, upload.single('venue_image'), (req, res) => {
    // #swagger.tags = ['Venue']
    // #swagger.description = 'Upload venue image'
    venueIamgeUpload(req, res);
});

venueRouter.get('/venueImages/:venueId', venueVerifyToken, (req, res) => {
    // #swagger.tags = ['Venue']
    // #swagger.description = 'Get venue images by venue ID'
    getVenueImages(req, res);
});

venueRouter.delete('/venueImage/:venueImageId', venueVerifyToken, (req, res) => {
    // #swagger.tags = ['Venue']
    // #swagger.description = 'Delete venue image by image ID'
    deleteVenueImage(req, res);
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

venueRouter.get('/sports/:venueId', venueVerifyToken, (req, res) => {
    // #swagger.tags = ['Venue']
    // #swagger.description = 'Get sports offered by the venue'
    venueSports(req, res);
});

venueRouter.post('/sports', venueVerifyToken, (req, res) => {
    // #swagger.tags = ['Venue']
    // #swagger.description = 'Add a sport to the venue'
    CreateVenueSport(req, res);
});

venueRouter.get('/allSports', venueVerifyToken, (req, res) => {
    // #swagger.tags = ['Venue']
    // #swagger.description = 'Get all available sports'
    getAllSports(req, res);
});

venueRouter.delete('/sports/:venueSportId', venueVerifyToken, (req, res) => {
    // #swagger.tags = ['Venue']
    // #swagger.description = 'Delete a sport from the venue'
    deleteVenueSport(req, res);
});

venueRouter.put('/sports/:venueSportId', venueVerifyToken, (req, res) => {
    // #swagger.tags = ['Venue']
    // #swagger.description = 'Update a sport for the venue'
    updateVenueSport(req, res);
});

venueRouter.get('/bookings/:venueId', venueVerifyToken, (req, res) => {
    // #swagger.tags = ['Venue']
    // #swagger.description = 'Get bookings for the venue'
    venueBookings(req, res);
});

venueRouter.delete('/bookings/:bookingId', venueVerifyToken, (req, res) => {
    // #swagger.tags = ['Venue']
    // #swagger.description = 'Delete a booking by ID'
    deleteBooking(req, res);
});

venueRouter.patch('/bookings/deactivate/:game_id', venueVerifyToken, (req, res) => {
    // #swagger.tags = ['Venue']
    // #swagger.description = 'Deactivate a booking by ID'
    deactiveBooking(req, res);
});

venueRouter.patch('/bookings/payment-status/:bookingId', venueVerifyToken, (req, res) => {
    // #swagger.tags = ['Venue']
    // #swagger.description = 'Update payment status of a booking by ID'
    paymentStatusUpdate(req, res);
});

venueRouter.get('/allVenueSlots/:venueId', venueVerifyToken, (req, res) => {
    // #swagger.tags = ['Venue']
    // #swagger.description = 'Get slots for the venue'
    getAllSlotsOfVenue(req, res);
});

venueRouter.delete('/slots/:slotId', venueVerifyToken, (req, res) => {
    // #swagger.tags = ['Venue']
    // #swagger.description = 'Delete a slot by ID'
    deleteSlot(req, res);
});

venueRouter.patch('/slots/:slotId', venueVerifyToken, (req, res) => {
    // #swagger.tags = ['Venue']
    // #swagger.description = 'Update a slot by ID'
    editSlot(req, res);
});

venueRouter.post('/slots', venueVerifyToken, (req, res) => {
    // #swagger.tags = ['Venue']
    // #swagger.description = 'Add a new slot'
    addNewSlot(req, res);
});

export default venueRouter;