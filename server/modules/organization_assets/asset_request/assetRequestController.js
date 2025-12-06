import { AssetRequest } from "./assetRequestModel.js";

export const createAssetRequest = async (req, res) => {
  try {
    const request = await AssetRequest.create(req.body);
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAssetRequests = async (req, res) => {
  try {
    const requests = await AssetRequest.getAll();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAssetRequestById = async (req, res) => {
  try {
    const request = await AssetRequest.getById(req.params.id);
    if (!request) return res.status(404).json({ error: "Asset request not found" });
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateAssetRequest = async (req, res) => {
  try {
    const updated = await AssetRequest.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Asset request not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteAssetRequest = async (req, res) => {
  try {
    const deleted = await AssetRequest.delete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Asset request not found" });
    res.json({ message: "Asset request deleted", deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
