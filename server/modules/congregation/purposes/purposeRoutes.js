import express from "express";
import {
  getAllPurposes,
  getPurposeById,
  createPurpose,
  updatePurpose,
  deletePurpose,
} from "./purposeController.js";

const router = express.Router();

// GET all purposes
router.get("/", getAllPurposes);

// GET single purpose by ID
router.get("/:id", getPurposeById);

// POST create a new purpose
router.post("/", createPurpose);

// PUT update a purpose by ID
router.put("/:id", updatePurpose);

// DELETE a purpose by ID
router.delete("/:id", deletePurpose);

export default router;
