import { MaintenanceRecord } from "./maintenanceRecord.js";

export const createMaintenanceRecord = async (req, res) => {
  try {
    const record = await MaintenanceRecord.create(req.body);
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMaintenanceRecords = async (req, res) => {
  try {
    const records = await MaintenanceRecord.getAll();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMaintenanceRecordById = async (req, res) => {
  try {
    const record = await MaintenanceRecord.getById(req.params.id);
    if (!record) return res.status(404).json({ error: "Record not found" });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateMaintenanceRecord = async (req, res) => {
  try {
    const updated = await MaintenanceRecord.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Record not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteMaintenanceRecord = async (req, res) => {
  try {
    const deleted = await MaintenanceRecord.delete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Record not found" });
    res.json({ message: "Record deleted", deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
