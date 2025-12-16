import express from 'express';
import { followUpsController } from './followUpController.js';

const router = express.Router();

router.get('/', followUpsController.getAll);
router.get('/:id', followUpsController.getById);
router.post('/', followUpsController.create);
router.put('/:id', followUpsController.update);
router.delete('/:id', followUpsController.delete);

router.get('/member/:member_id', followUpsController.getByMember);

export default router;
