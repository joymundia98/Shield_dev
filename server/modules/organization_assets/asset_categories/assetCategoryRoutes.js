import express from "express";
import {
  createAssetCategory,
  getAssetCategories
} from "./assetCategoryController.js";

const router = express.Router();

router.post("/", createAssetCategory);
router.get("/", getAssetCategories);

export default router;
