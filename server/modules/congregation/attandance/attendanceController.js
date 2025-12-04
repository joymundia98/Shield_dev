import Attendance from "./attendanceModel.js";

const AttendanceController = {
  async getAll(req, res) {
    try {
      const data = await Attendance.getAll();
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const data = await Attendance.getById(id);
      if (!data) return res.status(404).json({ message: "Attendance not found" });
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const data = await Attendance.create(req.body);
      return res.status(201).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const existing = await Attendance.getById(id);
      if (!existing) return res.status(404).json({ message: "Attendance not found" });

      const updated = await Attendance.update(id, req.body);
      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Attendance.delete(id);
      if (!deleted) return res.status(404).json({ message: "Attendance not found" });
      return res.json({ message: "Attendance deleted successfully" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};

export default AttendanceController;
