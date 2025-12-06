import { MaintenanceCategory } from "./maintenanceCategory.js";

export const createMaintenanceCategory = async (req, res) => {
  try {
    const category = await MaintenanceCategory.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMaintenanceCategories = async (req, res) => {
  try {
    const categories = await MaintenanceCategory.getAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMaintenanceCategoryById = async (req, res) => {
  try {
    const category = await MaintenanceCategory.getById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateMaintenanceCategory = async (req, res) => {
  try {
    const updated = await MaintenanceCategory.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Category not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteMaintenanceCategory = async (req, res) => {
  try {
    const deleted = await MaintenanceCategory.delete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Category not found" });
    res.json({ message: "Category deleted", deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
