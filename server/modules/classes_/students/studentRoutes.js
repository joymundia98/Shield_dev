import express from 'express';
import { studentsController } from './studentController.js';

const router = express.Router();

router.get('/', studentsController.getAll);
router.get('/:id', studentsController.getById);
router.post('/', studentsController.create);
router.put('/:id', studentsController.update);
router.delete('/:id', studentsController.delete);

export default router;
