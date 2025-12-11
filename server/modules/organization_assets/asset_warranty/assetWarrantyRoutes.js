import express from "express";
import {
  getAllWarranties,
  getWarrantyById,
  createWarranty,
  updateWarranty,
  deleteWarranty
} from "./assetWarrantyController.js";

const router = express.Router();

router.get("/", getAllWarranties);
router.get("/:id", getWarrantyById);
router.post("/", createWarranty);
router.put("/:id", updateWarranty);
router.delete("/:id", deleteWarranty);

export default router;
