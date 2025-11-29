import { Router } from "express";
import LeaveRequestsController from "./leaveController.js";

const router = Router();

router.get("/", LeaveRequestsController.getAll);

router.get("/:id", LeaveRequestsController.getById);

router.get("/staff/:staffId", LeaveRequestsController.getByStaff);

router.post("/", LeaveRequestsController.create);

router.put("/:id", LeaveRequestsController.update);

router.delete("/:id", LeaveRequestsController.delete);

export default router;
