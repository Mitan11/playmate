import express from 'express';
import { registerVenue, venueLogin } from '../controllers/venueController.js';
import { venueVerifyToken } from '../middleware/authUser.js';

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

export default venueRouter;