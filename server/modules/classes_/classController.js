import ClassesModel from './class.js';

export const classesController = {
  async getAll(req, res) {
    try {
      const organization_id = req.auth.organization_id;
      const organization_id = req.user.organization_id;
      const classes = await ClassesModel.findAll(organization_idorganization_id);
      res.json(classes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch classes' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const classItem = await ClassesModel.findById(id);
      if (!classItem) return res.status(404).json({ error: 'Class not found' });
      res.json(classItem);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch class' });
    }
  },

  async create(req, res) {
    try {
      const data = req.body;
      const newClass = await ClassesModel.create(data);
      res.status(201).json(newClass);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create class' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const updatedClass = await ClassesModel.update(id, data);
      if (!updatedClass) return res.status(404).json({ error: 'Class not found' });
      res.json(updatedClass);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update class' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      await ClassesModel.delete(id);
      res.json({ message: 'Class deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete class' });
    }
  },
};
