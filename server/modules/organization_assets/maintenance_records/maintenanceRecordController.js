import { MaintenanceRecord } from "./maintenanceRecord.js";

// ✅ CREATE
export const createMaintenanceRecord = async (req, res) => {
  try {
    const record = await MaintenanceRecord.create({
      ...req.body,
      organization_id: req.auth.organization_id
    });

    res.status(201).json(record);
  } catch (err) {
    console.error("Create maintenance record error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET ALL (scoped)
export const getMaintenanceRecords = async (req, res) => {
  try {
    const records = await MaintenanceRecord.getAll(
      req.auth.organization_id
    );

    res.json(records); // ✅ return [] if empty (NOT 404)
  } catch (err) {
    console.error("Get maintenance records error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET BY ID (scoped)
export const getMaintenanceRecordById = async (req, res) => {
  try {
    const record = await MaintenanceRecord.getById(
      req.params.id,
      req.auth.organization_id
    );

    if (!record) {
      return res.status(404).json({ error: "Record not found" });
    }

    res.json(record);
  } catch (err) {
    console.error("Get maintenance record error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ UPDATE (scoped)
export const updateMaintenanceRecord = async (req, res) => {
  try {
    const updated = await MaintenanceRecord.update(
      req.params.id,
      req.auth.organization_id,
      req.body
    );

    if (!updated) {
      return res.status(404).json({ error: "Record not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Update maintenance record error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ DELETE (scoped)
export const deleteMaintenanceRecord = async (req, res) => {
  try {
    const deleted = await MaintenanceRecord.delete(
      req.params.id,
      req.auth.organization_id
    );

    if (!deleted) {
      return res.status(404).json({ error: "Record not found" });
    }

    res.json({ message: "Record deleted", deleted });
  } catch (err) {
    console.error("Delete maintenance record error:", err);
    res.status(500).json({ error: err.message });
  }
};