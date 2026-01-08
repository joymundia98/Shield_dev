import Staff from "../staff/staffModel.js";

const StaffController = {
  // 🔒 Admin only (all orgs) – optional
  async getAll(req, res) {
    try {
      const organization_id = req.auth.organization_id;
      const data = await Staff.getAll(organization_id);
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 🔐 Get staff by org (recommended default)
  async getByOrganization(req, res) {
    try {
      const orgId = req.auth.organization_id;
      const data = await Staff.getByOrganization(orgId);
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const orgId = req.auth.organization_id;

      const data = await Staff.getById(id, orgId);

      if (!data)
        return res.status(404).json({ message: "Staff not found" });

      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const orgId = req.auth.organization_id;

      const newStaff = await Staff.create(req.body, orgId);
      return res.status(201).json(newStaff);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const orgId = req.auth.organization_id;

      const existing = await Staff.getById(id, orgId);
      if (!existing)
        return res.status(404).json({ message: "Staff record not found" });

      const updated = await Staff.update(id, req.body, orgId);
      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const orgId = req.auth.organization_id;

      const deleted = await Staff.delete(id, orgId);
      if (!deleted)
        return res.status(404).json({ message: "Staff not found" });

      return res.json({ message: "Staff deleted successfully" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async getByDepartment(req, res) {
    try {
      const { id } = req.params; // department_id
      const orgId = req.auth.organization_id;

      const staff = await Staff.getByDepartment(id, orgId);
      return res.json(staff);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};

export default StaffController;
