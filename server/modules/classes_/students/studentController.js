import StudentsModel from './student.js';

export const studentsController = {
  async create(req, res) {
    try {
      const { full_name, age, contact } = req.body;
      const student = await StudentsModel.create(full_name, age, contact);
      res.status(201).json(student);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const students = await StudentsModel.findAll();
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const student = await StudentsModel.findById(id);
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
      const updated = await StudentsModel.update(id, full_name, age, contact);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      await StudentsModel.delete(id);
      res.json({ message: 'Student deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
