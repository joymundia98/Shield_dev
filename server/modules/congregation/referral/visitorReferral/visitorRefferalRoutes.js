import express from 'express';
import VisitorReferralController from './visitorReferralController.js';
import { verifyJWT } from '../../../../middleware/auth.js';

const router = express.Router();

router.use(verifyJWT);

// Add a referral source for a visitor
router.post('/', VisitorReferralController.add);

// Remove a referral source from a visitor
router.delete('/:visitor_id/:referral_id', VisitorReferralController.remove);

// Get all referral sources for a specific visitor
router.get('/:visitor_id', VisitorReferralController.getReferralsByVisitor);

// Get a specific visitor-referral record
router.get('/:visitor_id/:referral_id/find', VisitorReferralController.find);

// Update a visitor-referral record (optional notes/status)
router.put('/:visitor_id/:referral_id', VisitorReferralController.update);

// Get all visitors linked to a specific referral
router.get('/referral/:referral_id/visitors', VisitorReferralController.getVisitorsByReferral);

export default router;
