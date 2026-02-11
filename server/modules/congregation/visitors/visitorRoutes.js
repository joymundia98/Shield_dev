import express from 'express';
import VisitorController from './visitorController.js';
import { verifyJWT } from '../../../middleware/auth.js';

const router = express.Router();

router.use(verifyJWT);

// Routes for visitors
router.get('/', VisitorController.getAll); // Get all visitors
router.get('/:id', VisitorController.getById); // Get a specific visitor by ID
router.post('/', VisitorController.create); // Create a new visitor
router.patch('/:id', VisitorController.update); // Update an existing visitor
router.put('/:id', VisitorController.update)
router.delete('/:id', VisitorController.delete); // Delete a visitor

export default router;
