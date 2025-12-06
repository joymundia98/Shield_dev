import express from "express";
import {
  createMaintenanceCategory,
  getMaintenanceCategories,
  getMaintenanceCategoryById,
  updateMaintenanceCategory,
  deleteMaintenanceCategory
} from "./maintenanceCategoryController.js";

const router = express.Router();

router.post("/", createMaintenanceCategory);

router.get("/", getMaintenanceCategories);

router.get("/:id", getMaintenanceCategoryById);

router.put("/:id", updateMaintenanceCategory);

router.delete("/:id", deleteMaintenanceCategory);

export default router;
