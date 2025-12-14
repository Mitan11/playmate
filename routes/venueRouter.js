import express from 'express';
import { login, profile, register } from '../controllers/venueController.js';
import upload from '../middleware/multer.js';
import { venueVerifyToken } from '../middleware/authUser.js';

const venueRouter = express.Router();

venueRouter.post('/register', upload.single('profile_image'), register);
venueRouter.post('/login', login);
venueRouter.get('/profile', venueVerifyToken, profile);
// venueRouter.get('/update-profile', venueVerifyToken, updateProfile);

// router.get('/:id', VenueOwnerController.profile);
// router.put('/:id', VenueOwnerController.update);
// venueRouter.post('/', VenueController.create);
// venueRouter.get('/:id', VenueController.getById);
// venueRouter.get('/owner/:ownerId', VenueController.listByOwner);
// router.post('/', VenueSportController.addVenueSport);
// router.get('/venue/:venueId', VenueSportController.listVenueSports);
// router.post('/courts', VenueSportController.addCourt);
// router.get('/courts/:venueSportId', VenueSportController.listCourts);


export default venueRouter;