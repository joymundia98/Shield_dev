import express from 'express';
import { classTeachersController } from './classTeacherController.js';

const router = express.Router();

router.get('/', classTeachersController.getAll);
router.get('/:id', classTeachersController.getById);
router.post('/', classTeachersController.create);
router.put('/:id', classTeachersController.update);
router.delete('/:id', classTeachersController.delete);

export default router;
