import { Router } from "express";
import LeaveRequestsController from "./leaveController.js";

const router = Router();

/**
 * ADMIN – get all leave requests (all orgs)
 */
router.get("/", LeaveRequestsController.getAll);

/**
 * ORG-SCOPED – get leave requests for logged-in organization
 */
router.get("/org", LeaveRequestsController.getByOrganization);

/**
 * Get leave requests by staff ID (org-scoped)
 */
router.get("/staff/:staffId", LeaveRequestsController.getByStaff);

/**
 * Get a specific leave request by ID (org-scoped)
 */
router.get("/:id", LeaveRequestsController.getById);

/**
 * Create a new leave request (org-scoped)
 */
router.post("/", LeaveRequestsController.create);

/**
 * Full update of a leave request
 */
router.put("/:id", LeaveRequestsController.update);

/**
 * Update leave request status (approve / reject)
 */
router.patch("/:id/status", LeaveRequestsController.updateStatus);

/**
 * Delete a leave request
 */
router.delete("/:id", LeaveRequestsController.delete);

export default router;
