import express from 'express';
import userController from './userController.js';

const router = express.Router();

//super admin routes
router.get('/all', userController.getAllUsers);
router.get('/all/active', userController.getAllActiveUsers);

// Specific status routes first
router.get('/active', userController.getActiveUsersByOrg);
router.get('/inactive', userController.getInactiveUsersByOrg);

// Then parameterized and general routes
router.get('/:id', userController.getById);
router.get('/', userController.getAll);
router.post('/', userController.create);
router.put('/:id', userController.update);

// Separate PATCH for role_id update (new route)
router.patch('/:id/role', userController.updateRole);  // new route for updating role_id

// Existing PATCH for updating status
router.patch('/:id', userController.updateStatus);

// DELETE route for deleting a user
router.delete('/:id', userController.delete);

export default router;
