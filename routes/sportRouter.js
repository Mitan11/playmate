import express from 'express';
import { addNewSport, deleteSport, getAllSports, healthCheck, updateSport } from '../controllers/sportController.js';

const sportRouter = express.Router();

// Health check route
sportRouter.get('/health', healthCheck);

// create new sport route
sportRouter.post('/addNewSport', addNewSport);

// get all sports route
sportRouter.get('/getAllSports', getAllSports);

// update sport route
sportRouter.put('/updateSport/:sportId', updateSport);

// delete sport route
sportRouter.delete('/deleteSport/:sportId', deleteSport);

export default sportRouter;