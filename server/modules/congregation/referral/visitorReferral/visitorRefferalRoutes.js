import express from 'express';
import VisitorReferralController from './visitorReferralController.js';

const router = express.Router();

// Routes for visitor-referral relationships
router.post('/', VisitorReferralController.add); // Add a referral source for a visitor
router.delete('/:visitor_id/:referral_id', VisitorReferralController.remove); // Remove a referral source from a visitor
router.get('/:visitor_id', VisitorReferralController.getReferralsByVisitor); // Get all referrals for a visitor

export default router;
