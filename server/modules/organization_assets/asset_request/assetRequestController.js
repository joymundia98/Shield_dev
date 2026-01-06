import { AssetRequest } from "./assetRequestModel.js";

// CREATE a new asset request (organization scoped)
export const createAssetRequest = async (req, res) => {
  try {
    const request = await AssetRequest.create({
      ...req.body,
      organization_id: req.user.organization_id, // inject org_id
    });
    res.status(201).json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create asset request" });
  }
};

// GET all asset requests for the organization
export const getAssetRequests = async (req, res) => {
  try {
    const requests = await AssetRequest.getAll(req.user.organization_id);
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch asset requests" });
  }
};

// GET asset request by ID (organization scoped)
export const getAssetRequestById = async (req, res) => {
  try {
    const request = await AssetRequest.getById(req.params.id, req.user.organization_id);
    if (!request) return res.status(404).json({ error: "Asset request not found" });
    res.json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch asset request" });
  }
};

// UPDATE asset request (organization scoped)
export const updateAssetRequest = async (req, res) => {
  try {
    const updated = await AssetRequest.update(
      req.params.id,
      req.user.organization_id,
      req.body
    );
    if (!updated) return res.status(404).json({ error: "Asset request not found or nothing to update" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update asset request" });
  }
};

// DELETE asset request (organization scoped)
export const deleteAssetRequest = async (req, res) => {
  try {
    const deleted = await AssetRequest.delete(req.params.id, req.user.organization_id);
    if (!deleted) return res.status(404).json({ error: "Asset request not found" });
    res.json({ message: "Asset request deleted", data: deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete asset request" });
  }
};
