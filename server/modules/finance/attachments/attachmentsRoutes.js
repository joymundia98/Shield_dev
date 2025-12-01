import express from 'express';
import AttachmentController from './attachmentsController.js';

const router = express.Router();

router.get('/', AttachmentController.list);
router.get('/:id', AttachmentController.getById);
router.post('/', AttachmentController.create);
router.delete('/:id', AttachmentController.delete);

export default router;
