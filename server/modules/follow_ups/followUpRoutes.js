import express from 'express';
import { followUpsController } from './followUpController.js';

const router = express.Router();

router.get('/', followUpsController.getAll);
router.get('/:id', followUpsController.getById);
router.post('/', followUpsController.create);
router.patch('/:id', followUpsController.update);
router.delete('/:id', followUpsController.delete);

router.get('/member/:id', followUpsController.getByVisitor);

export default router;
