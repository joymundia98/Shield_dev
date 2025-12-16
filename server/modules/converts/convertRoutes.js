import express from 'express';
import { convertsController } from './convertController.js';

const router = express.Router();

router.get('/', convertsController.getAll);
router.get('/:id', convertsController.getById);
router.post('/', convertsController.create);
router.put('/:id', convertsController.update);
router.delete('/:id', convertsController.delete);

// Filters
router.get('/member/:member_id', convertsController.getByMember);
router.get('/visitor/:visitor_id', convertsController.getByVisitor);
router.get('/organization/:organization_id', convertsController.getByOrganization);

export default router;
