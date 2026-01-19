import { Asset } from "./assetModel.js";

// CREATE asset
export const createAsset = async (req, res) => {
  try {
    const asset = await Asset.create({
      ...req.body,
      organization_id: req.auth.organization_id, // inject org_id
    });
    res.status(201).json(asset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create asset" });
  }
};

// GET all assets for the organization
export const getAssets = async (req, res) => {
  try {
    const assets = await Asset.getAll(req.auth.organization_id);
    res.json(assets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch assets" });
  }
};

// GET asset by ID (organization scoped)
export const getAssetById = async (req, res) => {
  try {
    const asset = await Asset.getById(req.params.id, req.auth.organization_id);
    if (!asset) return res.status(404).json({ error: "Asset not found" });

    res.json(asset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch asset" });
  }
};

// UPDATE asset (organization scoped)
export const updateAsset = async (req, res) => {
  try {
    const updated = await Asset.update(
      req.params.id,
      req.auth.organization_id,
      req.body
    );

    if (!updated) return res.status(404).json({ error: "Asset not found" });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update asset" });
  }
};

// DELETE asset (organization scoped)
export const deleteAsset = async (req, res) => {
  try {
    const deleted = await Asset.delete(req.params.id, req.auth.organization_id);
    if (!deleted) return res.status(404).json({ error: "Asset not found" });

    res.json({ message: "Asset deleted", data: deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete asset" });
  }
};
