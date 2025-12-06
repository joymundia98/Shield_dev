import { Asset } from "./assetModel.js";

export const createAsset = async (req, res) => {
  try {
    const asset = await Asset.create(req.body);
    res.status(201).json(asset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAssets = async (req, res) => {
  try {
    const assets = await Asset.getAll();
    res.json(assets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAssetById = async (req, res) => {
  try {
    const asset = await Asset.getById(req.params.id);
    if (!asset) return res.status(404).json({ error: "Asset not found" });

    res.json(asset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateAsset = async (req, res) => {
  try {
    const updated = await Asset.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Asset not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteAsset = async (req, res) => {
  try {
    const deleted = await Asset.delete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Asset not found" });

    res.json({ message: "Asset deleted", deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
