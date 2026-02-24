// controllers/leaveRequestsController.js
import LeaveRequest from "../leave/leaveModel.js";

const LeaveRequestsController = {
  // GET /leave-requests (ADMIN / SUPER ADMIN)
  async getAll(req, res) {
    try {
      const organization_id = req.auth.organization_id
      const data = await LeaveRequest.getAll(organization_id);
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // GET /leave-requests/org (ORG-SCOPED)
  async getByOrganization(req, res) {
    try {
      const orgId = req.auth.organization_id;
      const data = await LeaveRequest.getByOrganization(orgId);
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // GET /leave-requests/:id
  async getById(req, res) {
    try {
      const { id } = req.params;
      const orgId = req.auth.organization_id;

      const data = await LeaveRequest.getById(id, orgId);
      if (!data) {
        return res.status(404).json({ message: "Leave request not found" });
      }

      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // POST /leave-requests
  async create(req, res) {
    try {
      const organization_id = req.auth.organization_id;

      const payload = {
        ...req.body,
        organization_id: organization_id
      };

      const newReq = await LeaveRequest.create(payload);
      return res.status(201).json(newReq);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // PUT /leave-requests/:id (full update)
  async update(req, res) {
    try {
      const { id } = req.params;
      const orgId = req.auth.organization_id;

      const existing = await LeaveRequest.getById(id, orgId);
      if (!existing) {
        return res.status(404).json({ message: "Leave request not found" });
      }

      const updated = await LeaveRequest.update(id, req.body, orgId);
      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // PATCH /leave-requests/:id/status
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const orgId = req.auth.organization_id;

      if (!["approved", "rejected", "pending"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }

      const existing = await LeaveRequest.getById(id, orgId);
      if (!existing) {
        return res.status(404).json({ message: "Leave request not found" });
      }

      const updated = await LeaveRequest.updateStatus(id, status, orgId);
      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // DELETE /leave-requests/:id
  async delete(req, res) {
    try {
      const { id } = req.params;
      const orgId = req.auth.organization_id;

      const deleted = await LeaveRequest.delete(id, orgId);
      if (!deleted) {
        return res.status(404).json({ message: "Leave request not found" });
      }

      return res.json({ message: "Leave request deleted successfully" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // GET /leave-requests/staff/:staffId
  async getByStaff(req, res) {
    try {
      const { staffId } = req.params;
      const orgId = req.auth.organization_id;

      const data = await LeaveRequest.getByStaff(staffId, orgId);
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};

export default LeaveRequestsController;
