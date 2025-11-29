import { Router } from "express";
import DepartmentsController from "./departmentController.js";

const router = Router();

router.get("/", DepartmentsController.getAll);

router.get("/:id", DepartmentsController.getById);

router.post("/", DepartmentsController.create);

router.put("/:id", DepartmentsController.update);

router.delete("/:id", DepartmentsController.delete);

export default router;
