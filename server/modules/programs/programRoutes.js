import express from 'express';
import { programController } from './programController.js';

const router = express.Router();

router.get('/', programController.getAll);
router.get('/:id', programController.getById);
router.post('/', programController.create);
router.put('/:id', programController.update);
router.delete('/:id', programController.delete);

// Get programs by status
router.get('/status/:status', programController.getByStatus);

export default router;
