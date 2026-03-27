import express from "express";
import { PaymentController } from "./paymentsController.js";
import { verifyJWT } from "../../middleware/auth.js";

const router = express.Router();

/**
 * Initiate payment
 */
router.post(
  "/initiate",
  verifyJWT,
  PaymentController.initiatePayment
);


router.post(
  "/confirm",
  PaymentController.confirmPayment
);

/**
 * Handle failed payment
 */
router.post(
  "/fail",
  PaymentController.failPayment
);

/**
 * Get current user's payments
 */
router.get(
  "/me",
  verifyJWT,
  PaymentController.getMyPayments
);

/**
 * Get single payment
 */
router.get(
  "/:id",
  verifyJWT,
  PaymentController.getPaymentById
);

export default router;