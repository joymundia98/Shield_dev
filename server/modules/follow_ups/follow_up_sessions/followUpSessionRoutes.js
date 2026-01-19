import express from 'express';
import { followUpSessionsController } from './followUpSessionController.js';

const router = express.Router();

// CRUD
router.get('/', followUpSessionsController.getAll);
router.get('/:id', followUpSessionsController.getById);
router.post('/', followUpSessionsController.create);
router.patch('/:id', followUpSessionsController.update);
router.delete('/:id', followUpSessionsController.delete);

// Additional filters
router.get('/counsellor/:counsellor_id', followUpSessionsController.getByCounsellor);
router.get('/session/:session_id', followUpSessionsController.getBySession);

export default router;
