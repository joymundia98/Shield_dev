import express from 'express';
import { studentsController } from './studentController.js';
import { verifyJWT } from '../../../middleware/auth.js';

const router = express.Router();

router.use(verifyJWT);

router.get('/', studentsController.getAll);
router.get('/:id', studentsController.getById);
router.post('/', studentsController.create);
router.patch('/:id', studentsController.update);
router.delete('/:id', studentsController.delete);

export default router;
