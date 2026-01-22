// routes/userRoutes.js
import express from 'express';
import userController from './userController.js';

const router = express.Router();

// Specific status routes first
router.get('/active', userController.getActiveUsers);
router.get('/inactive', userController.getInactiveUsers);

// Then parameterized and general routes
router.get('/:id', userController.getById);
router.get('/', userController.getAll);
router.post('/', userController.create);
router.put('/:id', userController.update);

// New route to update user role
router.patch('/:id/role', userController.updateRole);

router.patch('/:id', userController.updateStatus);
router.delete('/:id', userController.delete);

export default router;
