import express from 'express';
import churchController from './churchController.js';

const router = express.Router();

router.get('/', churchController.getAll);
router.get('/:id', churchController.getById);
router.post('/', churchController.create);
router.put('/:id', churchController.update);
router.delete('/:id', churchController.delete);

export default router;
