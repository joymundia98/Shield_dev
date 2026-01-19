import express from 'express';
import ministriesController from './ministryController.js';
import { verifyJWT } from '../../../middleware/auth.js';

const router = express.Router();

router.use(verifyJWT);
// CRUD routes
router.get('/', ministriesController.getAll);
router.get('/:id', ministriesController.getById);
router.get('/church/:church_id', ministriesController.getByChurchId);
router.post('/', ministriesController.create);
router.patch('/:id', ministriesController.update);
router.delete('/:id', ministriesController.delete);

export default router;
