import StudentsModel from './student.js';

export const studentsController = {
  async create(req, res) {
    try {
      const { full_name, age, contact } = req.body;
      const organization_id = req.auth.organization_id; // get org id from logged-in user
      const student = await StudentsModel.create({ full_name, age, contact, organization_id });
      res.status(201).json(student);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const organization_id = req.auth.organization_id;
      const students = await StudentsModel.findAll(organization_id);
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const organization_id = req.auth.organization_id;
      const student = await StudentsModel.findById(id, organization_id);
      if (!student) return res.status(404).json({ message: 'Student not found' });
      res.json(student);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { full_name, age, contact } = req.body;
      const organization_id = req.auth.organization_id;
      const updated = await StudentsModel.update(id, { full_name, age, contact, organization_id });
      if (!updated) return res.status(404).json({ message: 'Student not found' });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const organization_id = req.auth.organization_id;
      const deleted = await StudentsModel.delete(id, organization_id);
      if (!deleted) return res.status(404).json({ message: 'Student not found' });
      res.json({ message: 'Student deleted successfully', deleted });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
