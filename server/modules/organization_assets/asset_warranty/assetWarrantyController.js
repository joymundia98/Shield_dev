import { AssetWarranty } from "./assetWarranty.js";

// Controller functions for asset warranties
export const getAllWarranties = async (req, res) => {
  try {
    const data = await AssetWarranty.getAll();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch warranties" });
  }
};

export const getWarrantyById = async (req, res) => {
  try {
    const data = await AssetWarranty.getById(req.params.id);
    if (!data) return res.status(404).json({ error: "Warranty not found" });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch warranty" });
  }
};

export const createWarranty = async (req, res) => {
  try {
    const data = await AssetWarranty.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create warranty" });
  }
};

export const updateWarranty = async (req, res) => {
  try {
    const data = await AssetWarranty.update(req.params.id, req.body);
    if (!data) return res.status(404).json({ error: "Warranty not found or nothing to update" });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update warranty" });
  }
};

export const deleteWarranty = async (req, res) => {
  try {
    const data = await AssetWarranty.delete(req.params.id);
    if (!data) return res.status(404).json({ error: "Warranty not found" });
    res.json({ message: "Warranty deleted", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete warranty" });
  }
};
