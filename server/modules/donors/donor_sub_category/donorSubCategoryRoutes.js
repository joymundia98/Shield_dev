import express from "express";
import {
  getAllSubcategories,
  getSubcategoryById,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from "./donorSubCategoryController.js";

const router = express.Router();

// GET all subcategories
router.get("/", getAllSubcategories);

// GET single subcategory by ID
router.get("/:id", getSubcategoryById);

// POST create a new subcategory
router.post("/", createSubcategory);

// PUT update a subcategory by ID
router.put("/:id", updateSubcategory);

// DELETE a subcategory by ID
router.delete("/:id", deleteSubcategory);

export default router;
