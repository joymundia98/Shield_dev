import { AssetLocation } from "./assetLocationModel.js";

export const createAssetLocation = async (req, res) => {
  try {
    const location = await AssetLocation.create(req.body);
    res.json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAssetLocations = async (req, res) => {
  try {
    const locations = await AssetLocation.getAll();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAssetLocationById = async (req, res) => {
  try {
    const location = await AssetLocation.getById(req.params.id);
    res.json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateAssetLocation = async (req, res) => {
  try {
    const location = await AssetLocation.update(req.params.id, req.body);
    res.json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteAssetLocation = async (req, res) => {
  try {
    const location = await AssetLocation.delete(req.params.id);
    res.json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
