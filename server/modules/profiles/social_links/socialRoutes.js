import express from 'express';
import socialLinksController from './socialController.js';

const router = express.Router();

// CRUD routes
router.get('/', socialLinksController.getAll);
router.get('/:id', socialLinksController.getById);
router.get('/church/:church_id', socialLinksController.getByChurchId);
router.post('/', socialLinksController.create);
router.put('/:id', socialLinksController.update);
router.delete('/:id', socialLinksController.delete);

export default router;
