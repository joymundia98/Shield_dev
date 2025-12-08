// controllers/leaveRequestsController.js
import LeaveRequest from "../leave/leaveModel.js";

const LeaveRequestsController = {
  async getAll(req, res) {
    try {
      const data = await LeaveRequest.getAll();
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const data = await LeaveRequest.getById(id);

      if (!data)
        return res.status(404).json({ message: "Leave request not found" });

      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const newReq = await LeaveRequest.create(req.body);
      return res.status(201).json(newReq);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // Existing update method (used for full updates)
  async update(req, res) {
    try {
      const { id } = req.params;

      const existing = await LeaveRequest.getById(id);
      if (!existing)
        return res.status(404).json({ message: "Leave request not found" });

      const updated = await LeaveRequest.update(id, req.body);
      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // New method for updating the status
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;  // 'approved' or 'rejected'

      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }

      const existing = await LeaveRequest.getById(id);
      if (!existing)
        return res.status(404).json({ message: "Leave request not found" });

      const updated = await LeaveRequest.updateStatus(id, status);
      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      const deleted = await LeaveRequest.delete(id);
      if (!deleted)
        return res.status(404).json({ message: "Leave request not found" });

      return res.json({ message: "Leave request deleted successfully" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async getByStaff(req, res) {
    try {
      const { staffId } = req.params;
      const data = await LeaveRequest.getByStaff(staffId);
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};

export default LeaveRequestsController;
