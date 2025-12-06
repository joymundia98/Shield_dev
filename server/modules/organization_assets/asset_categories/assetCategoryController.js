import { AssetCategory } from "./assetCategoryModel.js";

export const createAssetCategory = async (req, res) => {
  try {
    const category = await AssetCategory.create(req.body);
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAssetCategories = async (req, res) => {
  try {
    res.json(await AssetCategory.getAll());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
