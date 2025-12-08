import Attendance from "./attendanceModel.js";

const AttendanceController = {
  // Get all attendance records
  async getAll(req, res) {
    try {
      const data = await Attendance.getAll();
      return res.json(data);
    } catch (err) {
      console.error("Error fetching all attendance records:", err);
      return res.status(500).json({ error: err.message });
    }
  },

  // Get attendance record by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const data = await Attendance.getById(id);
      if (!data) return res.status(404).json({ message: "Attendance not found" });
      return res.json(data);
    } catch (err) {
      console.error("Error fetching attendance by ID:", err);
      return res.status(500).json({ error: err.message });
    }
  },

  // Create a new attendance record
  async create(req, res) {
    try {
      // Log the incoming request body to verify it's being sent correctly
      console.log("Request body:", req.body);

      const data = req.body;

      // Destructure necessary fields from the request body
      const { service_id, member_id, visitor_id, status, attendance_date } = data;

      // Check if attendance_date is present
      if (!attendance_date) {
        return res.status(400).json({ error: "Attendance date is required." });
      }

      // Check if we have either member_id or visitor_id
      if (!member_id && !visitor_id) {
        return res.status(400).json({ error: "Either member_id or visitor_id must be provided." });
      }

      // Log the values before proceeding to SQL
      console.log("Parsed data:", {
        service_id,
        member_id,
        visitor_id,
        status,
        attendance_date
      });

      // Determine the correct query and parameters based on member_id or visitor_id
      let query, queryParams;

      if (member_id) {
        query = `INSERT INTO attendance_records (service_id, member_id, status, attendance_date)
                 VALUES ($1, $2, $3, $4)
                 RETURNING record_id, status, attendance_date, created_at`;
        queryParams = [service_id, member_id, status, attendance_date];
      } else if (visitor_id) {
        query = `INSERT INTO attendance_records (service_id, visitor_id, status, attendance_date)
                 VALUES ($1, $2, $3, $4)
                 RETURNING record_id, status, attendance_date, created_at`;
        queryParams = [service_id, visitor_id, status, attendance_date];
      }

      // Log the query and parameters before executing
      console.log("SQL Query:", query);
      console.log("SQL Parameters:", queryParams);

      // Insert attendance into the database and return the result
      const result = await Attendance.create(query, queryParams);

      // Return the new attendance record
      return res.status(201).json(result);
    } catch (err) {
      console.error("Error creating attendance:", err);
      return res.status(500).json({ error: err.message });
    }
  },

  // Update an existing attendance record
  async update(req, res) {
    try {
      const { id } = req.params;
      const existing = await Attendance.getById(id);
      if (!existing) return res.status(404).json({ message: "Attendance not found" });

      // Update attendance status based on the incoming request body
      const updated = await Attendance.update(id, req.body);
      return res.json(updated);
    } catch (err) {
      console.error("Error updating attendance:", err);
      return res.status(500).json({ error: err.message });
    }
  },

  // Delete an attendance record
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Attendance.delete(id);
      if (!deleted) return res.status(404).json({ message: "Attendance not found" });
      return res.json({ message: "Attendance deleted successfully" });
    } catch (err) {
      console.error("Error deleting attendance:", err);
      return res.status(500).json({ error: err.message });
    }
  },
};

export default AttendanceController;
