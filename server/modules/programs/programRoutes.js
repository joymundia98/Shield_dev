import express from 'express';
import { programController } from './programController.js';
import { attendeeController } from './attendees/attendeeController.js';

const router = express.Router();

// Get attendees for a specific program (must be before :id)
// router.get('/:program_id/attendees', attendeeController.getByProgram);

// // Get programs by status
// router.get('/status/:status', programController.getByStatus);

// Get all programs
router.get('/org/:id', programController.getAll);

// Get a single program by ID
router.get('/:id', programController.getById);

// CRUD operations
router.post('/', programController.create);
router.put('/:id', programController.update);
router.delete('/:id', programController.delete);

export default router;
