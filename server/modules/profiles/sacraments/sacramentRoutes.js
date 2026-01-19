import express from 'express';
import sacramentsController from './sacrament.js';
import { verifyJWT } from '../../../middleware/auth.js';

const router = express.Router();

router.use(verifyJWT);
// CRUD routes
router.get('/', sacramentsController.getAll);
router.get('/:id', sacramentsController.getById);
router.get('/church/:church_id', sacramentsController.getByChurchId);
router.post('/', sacramentsController.create);
router.patch('/:id', sacramentsController.update);
router.delete('/:id', sacramentsController.delete);

export default router;
