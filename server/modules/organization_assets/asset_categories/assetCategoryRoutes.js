import express from "express";
import {
  createAssetCategory,
  getAssetCategories,
  getAssetCategoryById,
  updateAssetCategory,
  deleteAssetCategory
} from "./assetCategoryController.js";

const router = express.Router();

router.post("/", createAssetCategory);
router.get("/", getAssetCategories);
router.get("/:id", getAssetCategoryById);
router.put("/:id", updateAssetCategory);
router.delete("/:id", deleteAssetCategory);


export default router;
