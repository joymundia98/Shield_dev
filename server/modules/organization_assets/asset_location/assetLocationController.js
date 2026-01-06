import { AssetLocation } from "./assetLocationModel.js";

// CREATE location (organization scoped)
export const createAssetLocation = async (req, res) => {
  try {
    const location = await AssetLocation.create({
      ...req.body,
      organization_id: req.auth.organization_id, // inject org_id
    });
    res.status(201).json(location);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create location" });
  }
};

// GET all locations for the organization
export const getAssetLocations = async (req, res) => {
  try {
    const locations = await AssetLocation.getAll(req.auth.organization_id);
    res.json(locations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
};

// GET location by ID (organization scoped)
export const getAssetLocationById = async (req, res) => {
  try {
    const location = await AssetLocation.getById(req.params.id, req.auth.organization_id);
    if (!location) return res.status(404).json({ error: "Location not found" });
    res.json(location);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch location" });
  }
};

// UPDATE location (organization scoped)
export const updateAssetLocation = async (req, res) => {
  try {
    const location = await AssetLocation.update(req.params.id, req.auth.organization_id, req.body);
    if (!location) return res.status(404).json({ error: "Location not found or nothing to update" });
    res.json(location);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update location" });
  }
};

// DELETE location (organization scoped)
export const deleteAssetLocation = async (req, res) => {
  try {
    const location = await AssetLocation.delete(req.params.id, req.auth.organization_id);
    if (!location) return res.status(404).json({ error: "Location not found" });
    res.json({ message: "Location deleted", data: location });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete location" });
  }
};
