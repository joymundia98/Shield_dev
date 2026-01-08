import express from 'express';
import ServiceController from './serviceController.js';

const router = express.Router();

// Routes for services
router.get('/', ServiceController.getAll); // Get all services
router.get('/:id', ServiceController.getById); // Get a specific service by ID
router.post('/', ServiceController.create); // Create a new service
router.delete('/:id', ServiceController.delete); // Delete a service

export default router;
