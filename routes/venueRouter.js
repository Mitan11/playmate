import express from 'express';
import { registerVenue, updateVenueProfile, venueLogin, venueProfile } from '../controllers/venueController.js';
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

export default venueRouter;