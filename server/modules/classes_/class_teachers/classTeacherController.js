import ClassTeachersModel from './classTeacher.js';

export const classTeachersController = {
  async create(req, res) {
    try {
      const { class_id, teacher_id } = req.body;
      const newRecord = await ClassTeachersModel.create(class_id, teacher_id);
      res.status(201).json(newRecord);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const records = await ClassTeachersModel.findAll();
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const record = await ClassTeachersModel.findById(id);
      if (!record) return res.status(404).json({ message: 'Not found' });
      res.json(record);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { class_id, teacher_id } = req.body;
      const updatedRecord = await ClassTeachersModel.update(id, class_id, teacher_id);
      res.json(updatedRecord);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      await ClassTeachersModel.delete(id);
      res.json({ message: 'Deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
