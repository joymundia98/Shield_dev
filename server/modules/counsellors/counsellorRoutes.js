import express from 'express';
import { counsellorsController } from './counsellorController.js';
import { verifyJWT } from '../../middleware/auth.js';

const router = express.Router();

router.use(verifyJWT);
// CRUD endpoints
router.get('/', counsellorsController.getAll);
router.get('/:id', counsellorsController.getById);
router.post('/', counsellorsController.create);
router.put('/:id', counsellorsController.update);
router.delete('/:id', counsellorsController.delete);

export default router;
