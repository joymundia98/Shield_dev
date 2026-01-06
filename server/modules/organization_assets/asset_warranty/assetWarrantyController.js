import { AssetWarranty } from "./assetWarranty.js";

// GET all warranties for the organization
export const getAllWarranties = async (req, res) => {
  try {
    const data = await AssetWarranty.getAll(req.auth.organization_id);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch warranties" });
  }
};

// GET warranty by ID (organization scoped)
export const getWarrantyById = async (req, res) => {
  try {
    const data = await AssetWarranty.getById(req.params.id, req.auth.organization_id);
    if (!data) return res.status(404).json({ error: "Warranty not found" });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch warranty" });
  }
};

// CREATE warranty (organization scoped)
export const createWarranty = async (req, res) => {
  try {
    const data = await AssetWarranty.create({
      ...req.body,
      organization_id: req.auth.organization_id, // inject org_id
    });
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create warranty" });
  }
};

// UPDATE warranty (organization scoped)
export const updateWarranty = async (req, res) => {
  try {
    const data = await AssetWarranty.update(
      req.params.id,
      req.auth.organization_id,
      req.body
    );

    if (!data) return res.status(404).json({ error: "Warranty not found or nothing to update" });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update warranty" });
  }
};

// DELETE warranty (organization scoped)
export const deleteWarranty = async (req, res) => {
  try {
    const data = await AssetWarranty.delete(req.params.id, req.auth.organization_id);
    if (!data) return res.status(404).json({ error: "Warranty not found" });
    res.json({ message: "Warranty deleted", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete warranty" });
  }
};
