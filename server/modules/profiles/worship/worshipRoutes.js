import express from 'express';
import worshipController from './worshipController.js';

const router = express.Router();

// CRUD routes
router.get('/', worshipController.getAll);
router.get('/:id', worshipController.getById);
router.get('/church/:church_id', worshipController.getByChurchId);
router.post('/', worshipController.create);
router.put('/:id', worshipController.update);
router.delete('/:id', worshipController.delete);

export default router;
