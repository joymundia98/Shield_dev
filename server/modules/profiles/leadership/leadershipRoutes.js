import express from 'express';
import leadershipController from './leadershipController.js';
import { verifyJWT } from '../../../middleware/auth.js';

const router = express.Router();

router.use(verifyJWT);
// CRUD routes
router.get('/', leadershipController.getAll);
router.get('/:id', leadershipController.getById);
router.get('/church/:church_id', leadershipController.getByChurchId);
router.post('/', leadershipController.create);
router.put('/:id', leadershipController.update);
router.delete('/:id', leadershipController.delete);

export default router;
