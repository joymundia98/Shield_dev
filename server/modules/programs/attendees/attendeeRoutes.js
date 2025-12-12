import express from 'express';
import { attendeeController } from './attendeeController.js';

const router = express.Router();

router.get('/', attendeeController.getAll);
router.get('/:id', attendeeController.getById);
router.post('/', attendeeController.create);
router.put('/:id', attendeeController.update);
router.delete('/:id', attendeeController.delete);

// Get attendees by program
router.get('/program/:program_id', attendeeController.getByProgram);

export default router;
