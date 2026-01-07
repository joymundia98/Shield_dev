import express from 'express';
import churchController from './churchController.js';
import { verifyJWT } from '../../../middleware/auth.js';

const router = express.Router();

router.use(verifyJWT);

router.get('/', churchController.getAll);
router.get('/:id', churchController.getById);
router.post('/', churchController.create);
router.put('/:id', churchController.update);
router.delete('/:id', churchController.delete);

export default router;
