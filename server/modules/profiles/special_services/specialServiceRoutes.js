import express from 'express';
import specialServicesController from './specialServiceController.js';
import { verifyJWT } from '../../../middleware/auth.js';

const router = express.Router();

router.use(verifyJWT);
// CRUD routes
router.get('/', specialServicesController.getAll);
router.get('/:id', specialServicesController.getById);
router.get('/church/:church_id', specialServicesController.getByChurchId);
router.post('/', specialServicesController.create);
router.put('/:id', specialServicesController.update);
router.delete('/:id', specialServicesController.delete);

export default router;
