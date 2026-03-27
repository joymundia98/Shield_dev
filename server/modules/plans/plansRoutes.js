import express from "express";
import { PlanController } from "./plansController.js";
import { verifyJWT } from "../../middleware/auth.js";

const router = express.Router();

/**
 * Public - get plans (users need this to choose)
 */
router.get("/", PlanController.getPlans);
router.get("/:id", PlanController.getPlanById);

/**
 * Protected (Admin only ideally)
 */
router.post("/", verifyJWT, PlanController.createPlan);
router.put("/:id", verifyJWT, PlanController.updatePlan);
router.delete("/:id", verifyJWT, PlanController.deletePlan);

export default router;