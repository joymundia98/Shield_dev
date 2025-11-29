import { Router } from "express";
import StaffController from "../staff/staffController.js";

const router = Router();

router.get("/", StaffController.getAll);

router.get("/:id", StaffController.getById);

router.get("/department/:id", StaffController.getByDepartment);

router.post("/", StaffController.create);

router.put("/:id", StaffController.update);

router.delete("/:id", StaffController.delete);

export default router;
