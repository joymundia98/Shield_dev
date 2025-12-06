import express from "express";
import {
  createMaintenanceRecord,
  getMaintenanceRecords,
  getMaintenanceRecordById,
  updateMaintenanceRecord,
  deleteMaintenanceRecord
} from "./maintenanceRecordController.js";

const router = express.Router();

router.post("/", createMaintenanceRecord);

router.get("/", getMaintenanceRecords);

router.get("/:id", getMaintenanceRecordById);

router.put("/:id", updateMaintenanceRecord);

router.delete("/:id", deleteMaintenanceRecord);

export default router;
