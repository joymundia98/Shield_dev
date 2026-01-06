import { AssetCategory } from "./assetCategoryModel.js";

// CREATE category
export const createAssetCategory = async (req, res) => {
  try {
    const category = await AssetCategory.create({
      ...req.body,
      organization_id: req.auth.organization_id
    });

    res.status(201).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create asset category" });
  }
};

// GET ALL categories (organization scoped)
export const getAssetCategories = async (req, res) => {
  try {
    const categories = await AssetCategory.getAll(req.auth.organization_id);
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch asset categories" });
  }
};

// GET category by ID (organization scoped)
export const getAssetCategoryById = async (req, res) => {
  try {
    const category = await AssetCategory.getById(
      req.params.id,
      req.user.organization_id
    );

    if (!category) {
      return res.status(404).json({ error: "Asset category not found" });
    }

    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch asset category" });
  }
};

// UPDATE category (organization scoped)
export const updateAssetCategory = async (req, res) => {
  try {
    const updated = await AssetCategory.update(
      req.params.id,
      req.auth.organization_id,
      req.body
    );

    if (!updated) {
      return res
        .status(404)
        .json({ error: "Asset category not found or nothing to update" });
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update asset category" });
  }
};

// DELETE category (organization scoped)
export const deleteAssetCategory = async (req, res) => {
  try {
    const deleted = await AssetCategory.delete(
      req.params.id,
      req.auth.organization_id
    );

    if (!deleted) {
      return res.status(404).json({ error: "Asset category not found" });
    }

    res.json({
      message: "Asset category deleted successfully",
      data: deleted
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete asset category" });
  }
};
