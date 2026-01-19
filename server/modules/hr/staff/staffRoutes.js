import { Router } from "express";
import StaffController from "../staff/staffController.js";

const router = Router();

router.get("/", StaffController.getAll);

// GET all staff for the logged-in org
router.get("/org", StaffController.getByOrganization);

// GET a specific staff by ID (org-scoped)
router.get("/:id", StaffController.getById);

// GET staff by department (org-scoped)
router.get("/department/:id", StaffController.getByDepartment);

// CREATE a new staff member (org-scoped)
router.post("/", StaffController.create);

// UPDATE a staff member (org-scoped)
router.patch("/:id", StaffController.update);

// DELETE a staff member (org-scoped)
router.delete("/:id", StaffController.delete);

export default router;
