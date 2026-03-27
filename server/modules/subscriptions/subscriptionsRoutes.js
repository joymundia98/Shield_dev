import express from "express";
import { SubscriptionController } from "./subscriptionsController.js";
import { verifyJWT } from "../../middleware/auth.js";

const router = express.Router();

router.get("/me", verifyJWT, SubscriptionController.getMySubscription);

router.post("/", verifyJWT, SubscriptionController.createSubscription);

router.put("/:id/cancel", verifyJWT, SubscriptionController.cancelSubscription);

router.put("/:id/upgrade", verifyJWT, SubscriptionController.upgradeSubscription);

export default router;