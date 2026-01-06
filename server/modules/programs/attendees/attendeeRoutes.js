import express from 'express';
import { attendeeController } from './attendeeController.js';

const router = express.Router();

// List all attendees
router.get('/org/:id', attendeeController.getAll);

// Create a new attendee
router.post('/', attendeeController.create);

// Get attendee by ID
router.get('/:id', attendeeController.getById);

// Update attendee
router.put('/:id', attendeeController.update);

// Delete attendee
router.delete('/:id', attendeeController.delete);

export default router;
