import express from "express";
import {createAsset, getAssets, getAssetById, deleteAsset, updateAsset} from "./assetController.js";

const router = express.Router();

// Create asset
router.post("/", createAsset);

// Get all assets
router.get("/org/:id", getAssets);

// Get one asset
router.get("/:id", getAssetById);

// Update asset
router.put("/:id", updateAsset);

// Delete asset
router.delete("/:id", deleteAsset);

export default router;
