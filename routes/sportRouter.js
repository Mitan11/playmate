import express from 'express';
import { addNewSport, addUserSport, deleteSport, deleteUserSport, getAllSports, getUserSports, healthCheck, updateSport } from '../controllers/sportController.js';
import { verifyToken } from '../middleware/authUser.js';

const sportRouter = express.Router();

// Health check route
sportRouter.get('/health', (req, res) => {
    // #swagger.tags = ['Sports']
    // #swagger.description = 'Health check endpoint for sports service'
    healthCheck(req, res);
});

// create new sport route
sportRouter.post('/addNewSport', (req, res) => {
    // #swagger.tags = ['Sports']
    // #swagger.description = 'Add a new sport'
    addNewSport(req, res);
});

// get all sports route
sportRouter.get('/getAllSports', (req, res) => {
    // #swagger.tags = ['Sports']
    // #swagger.description = 'Get all available sports'
    getAllSports(req, res);
});

// update sport route
sportRouter.put('/updateSport/:sportId', (req, res) => {
    // #swagger.tags = ['Sports']
    // #swagger.description = 'Update sport details by ID'
    updateSport(req, res);
});

// delete sport route
sportRouter.delete('/deleteSport/:sportId', (req, res) => {
    // #swagger.tags = ['Sports']
    // #swagger.description = 'Delete sport by ID'
    deleteSport(req, res);
});

sportRouter.post('/addUserSport', verifyToken, (req, res) => {
    // #swagger.tags = ['Sports']
    // #swagger.description = 'Add a sport to a user with skill level'
    addUserSport(req, res);
});

sportRouter.get('/getUserSports/:userId', verifyToken, (req, res) => {
    // #swagger.tags = ['Sports']
    // #swagger.description = 'Get sports associated with a user'
    getUserSports(req, res);
});

sportRouter.delete('/deleteUserSport/:userSportId', verifyToken, (req, res) => {
    // #swagger.tags = ['Sports']
    // #swagger.description = 'Delete a sport from a user'
    deleteUserSport(req, res);
});

export default sportRouter;