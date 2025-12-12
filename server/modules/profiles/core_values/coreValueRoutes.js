import express from 'express';
import coreValuesController from './coreValueController.js';

const router = express.Router();

// CRUD routes
router.get('/', coreValuesController.getAll);
router.get('/:id', coreValuesController.getById);
router.get('/church/:church_id', coreValuesController.getByChurchId);
router.post('/', coreValuesController.create);
router.put('/:id', coreValuesController.update);
router.delete('/:id', coreValuesController.delete);

export default router;
