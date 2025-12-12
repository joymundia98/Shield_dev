import express from 'express';
import ministriesController from './ministryController.js';

const router = express.Router();

// CRUD routes
router.get('/', ministriesController.getAll);
router.get('/:id', ministriesController.getById);
router.get('/church/:church_id', ministriesController.getByChurchId);
router.post('/', ministriesController.create);
router.put('/:id', ministriesController.update);
router.delete('/:id', ministriesController.delete);

export default router;
