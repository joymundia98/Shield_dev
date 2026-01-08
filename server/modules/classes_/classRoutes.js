import express from 'express';
import { classesController } from './classController.js';
import { verifyJWT } from '../../middleware/auth.js';

const router = express.Router();

router.use(verifyJWT);

// CRUD endpoints
router.get('/', classesController.getAll);
router.get('/:id', classesController.getById);
router.post('/', classesController.create);
router.put('/:id', classesController.update);
router.delete('/:id', classesController.delete);

export default router;
