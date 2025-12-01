// modules/finance/extraFields/extraFieldRoutes.js
import express from 'express';
import ExtraFieldController from './extraFieldController.js';

const router = express.Router();

router.get('/', ExtraFieldController.list);
router.post('/', ExtraFieldController.create);
router.delete('/:id', ExtraFieldController.delete);

export default router;
