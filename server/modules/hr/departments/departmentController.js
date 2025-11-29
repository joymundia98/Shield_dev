// controllers/departmentsController.js
import Department from "./departmentModel.js";

const DepartmentsController = {
  async getAll(req, res) {
    try {
      const data = await Department.getAll();
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const data = await Department.getById(id);

      if (!data)
        return res.status(404).json({ message: "Department not found" });

      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const data = await Department.create(req.body);
      return res.status(201).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const existing = await Department.getById(id);

      if (!existing)
        return res.status(404).json({ message: "Department not found" });

      const updated = await Department.update(id, req.body);
      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      const deleted = await Department.delete(id);
      if (!deleted)
        return res.status(404).json({ message: "Department not found" });

      return res.json({ message: "Department deleted successfully" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};

export default DepartmentsController;
