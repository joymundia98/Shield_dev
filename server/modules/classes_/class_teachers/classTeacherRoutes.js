import express from 'express';
import { classTeachersController } from './classTeacherController.js';
import { verifyJWT } from '../../../middleware/auth.js';

const router = express.Router();

router.use(verifyJWT);

router.get('/', classTeachersController.getAll);
router.get('/:id', classTeachersController.getById);
router.post('/', classTeachersController.create);
router.put('/:id', classTeachersController.update);
router.delete('/:id', classTeachersController.delete);

export default router;
