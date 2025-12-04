import express from "express";
import {
  getAllDonorTypes,
  getDonorTypeById,
  createDonorType,
  updateDonorType,
  deleteDonorType,
} from "./donorTypeController.js";

const router = express.Router();

router.get("/", getAllDonorTypes);
router.get("/:id", getDonorTypeById);
router.post("/", createDonorType);
router.put("/:id", updateDonorType);
router.delete("/:id", deleteDonorType);

export default router;
