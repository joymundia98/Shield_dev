import express from "express";
import {
  createAssetRequest,
  getAssetRequests,
  getAssetRequestById,
  updateAssetRequest,
  deleteAssetRequest
} from "./assetRequestController.js";

const router = express.Router();

// CREATE
router.post("/", createAssetRequest);

// GET ALL
router.get("/", getAssetRequests);

// GET BY ID
router.get("/:id", getAssetRequestById);

// UPDATE
router.put("/:id", updateAssetRequest);

// DELETE
router.delete("/:id", deleteAssetRequest);

export default router;
