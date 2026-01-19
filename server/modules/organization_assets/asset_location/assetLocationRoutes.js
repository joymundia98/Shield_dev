import express from "express";
import {
  createAssetLocation,
  getAssetLocations,
  getAssetLocationById,
  updateAssetLocation,
  deleteAssetLocation
} from "./assetLocationController.js";

const router = express.Router();

router.post("/", createAssetLocation);
router.get("/", getAssetLocations);
router.get("/:id", getAssetLocationById);
router.patch("/:id", updateAssetLocation);
router.delete("/:id", deleteAssetLocation);

export default router;
