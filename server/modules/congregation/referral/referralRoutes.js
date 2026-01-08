import express from 'express';
import ReferralController from './referralController.js';
import { verifyJWT } from '../../../middleware/auth.js';

const router = express.Router();

router.use(verifyJWT);

// Routes for referrals
router.get('/', ReferralController.getAll); // Get all referral sources
router.get('/:id', ReferralController.getById); // Get a specific referral source by ID
router.post('/', ReferralController.create); // Create a new referral source
router.delete('/:id', ReferralController.delete); // Delete a referral source

export default router;
