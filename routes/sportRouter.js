import express from 'express';
import { addNewSport, deleteSport, getAllSports, healthCheck, updateSport } from '../controllers/sportController.js';

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

export default sportRouter;