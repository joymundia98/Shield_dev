import express from 'express';
import VisitorServiceController from './visitorServiceController.js';
import { verifyJWT } from '../../../../middleware/auth.js';

const router = express.Router();

router.use(verifyJWT);

// Routes for visitor-service relationships
router.post('/', VisitorServiceController.add); // Add a visitor to a service
router.delete('/:visitor_id/:service_id', VisitorServiceController.remove); // Remove visitor from a service
router.get('/:visitor_id', VisitorServiceController.getServicesByVisitor); // Get all services attended by a visitor

export default router;
