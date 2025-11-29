import Staff from "../staff/staffModel.js";

const StaffController = {
  async getAll(req, res) {
    try {
      const data = await Staff.getAll();
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const data = await Staff.getById(id);

      if (!data)
        return res.status(404).json({ message: "Staff not found" });

      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const newStaff = await Staff.create(req.body);
      return res.status(201).json(newStaff);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;

      const existing = await Staff.getById(id);
      if (!existing)
        return res.status(404).json({ message: "Staff record not found" });

      const updated = await Staff.update(id, req.body);
      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      const deleted = await Staff.delete(id);
      if (!deleted)
        return res.status(404).json({ message: "Staff not found" });

      return res.json({ message: "Staff deleted successfully" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async getByDepartment(req, res) {
    try {
      const { id } = req.params;
      const staff = await Staff.getByDepartment(id);
      return res.json(staff);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};

export default StaffController;
