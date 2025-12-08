import { Router } from "express";
import LeaveRequestsController from "./leaveController.js";

const router = Router();

// Get all leave requests
router.get("/", LeaveRequestsController.getAll);

// Get a specific leave request by ID
router.get("/:id", LeaveRequestsController.getById);

// Get leave requests by staff ID
router.get("/staff/:staffId", LeaveRequestsController.getByStaff);

// Create a new leave request
router.post("/", LeaveRequestsController.create);

// Update a leave request (full update)
router.put("/:id", LeaveRequestsController.update);

// Update the status of a leave request (approved/rejected)
router.patch("/:id/status", LeaveRequestsController.updateStatus); // This is the new route for updating status

// Delete a leave request
router.delete("/:id", LeaveRequestsController.delete);

export default router;
