import Attendance from "./attendanceModel.js";

const AttendanceController = {
  // GET ALL attendance records (organization scoped)
  async getAll(req, res) {
    try {
      const organization_id = req.auth.organization_id;

      const data = await Attendance.getAll(organization_id);
      return res.json(data);
    } catch (err) {
      console.error("Error fetching attendance records:", err);
      return res.status(500).json({ error: "Failed to fetch attendance records" });
    }
  },

  // GET attendance record by ID (organization scoped)
  async getById(req, res) {
    try {
      const { id } = req.params;
      const organization_id = req.auth.organization_id;

      const data = await Attendance.getById(id, organization_id);
      if (!data) {
        return res.status(404).json({ message: "Attendance not found" });
      }

      return res.json(data);
    } catch (err) {
      console.error("Error fetching attendance:", err);
      return res.status(500).json({ error: "Failed to fetch attendance record" });
    }
  },

  // CREATE a new attendance record (organization enforced)
  async create(req, res) {
    try {
      const organization_id = req.auth.organization_id;
      const {
        service_id,
        member_id,
        visitor_id,
        status,
        attendance_date
      } = req.body;

      if (!attendance_date) {
        return res.status(400).json({ error: "Attendance date is required" });
      }

      if (!member_id && !visitor_id) {
        return res.status(400).json({
          error: "Either member_id or visitor_id must be provided"
        });
      }

      const record = await Attendance.create(
        {
          service_id,
          member_id,
          visitor_id,
          status,
          attendance_date
        },
        organization_id
      );

      return res.status(201).json(record);
    } catch (err) {
      console.error("Error creating attendance:", err);
      return res.status(500).json({ error: "Failed to create attendance record" });
    }
  },

  // UPDATE attendance record (organization safe)
  async update(req, res) {
    try {
      const { id } = req.params;
      const organization_id = req.auth.organization_id;

      const existing = await Attendance.getById(id, organization_id);
      if (!existing) {
        return res.status(404).json({ message: "Attendance not found" });
      }

      const updated = await Attendance.update(
        id,
        organization_id,
        req.body
      );

      return res.json(updated);
    } catch (err) {
      console.error("Error updating attendance:", err);
      return res.status(500).json({ error: "Failed to update attendance record" });
    }
  },

  // DELETE attendance record (organization safe)
  async delete(req, res) {
    try {
      const { id } = req.params;
      const organization_id = req.auth.organization_id;

      const deleted = await Attendance.delete(id, organization_id);
      if (!deleted) {
        return res.status(404).json({ message: "Attendance not found" });
      }

      return res.json({ message: "Attendance deleted successfully" });
    } catch (err) {
      console.error("Error deleting attendance:", err);
      return res.status(500).json({ error: "Failed to delete attendance record" });
    }
  }
};

export default AttendanceController;
