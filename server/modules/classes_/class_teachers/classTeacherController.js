import ClassTeachersModel from './classTeacher.js';

export const classTeachersController = {
  async create(req, res) {
    try {
      const { class_id, teacher_id, organization_id } = req.body;
      if (!organization_id) return res.status(400).json({ error: 'organization_id is required' });

      const newRecord = await ClassTeachersModel.create({ class_id, teacher_id, organization_id });
      res.status(201).json(newRecord);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const { organization_id } = req.auth.organization_id;
      if (!organization_id) return res.status(400).json({ error: 'organization_id is required' });

      const records = await ClassTeachersModel.findAll(organization_id);
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const { organization_id } = req.auth.organization_id;
      if (!organization_id) return res.status(400).json({ error: 'organization_id is required' });

      const record = await ClassTeachersModel.findById(id, organization_id);
      if (!record) return res.status(404).json({ message: 'Record not found' });
      res.json(record);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { class_id, teacher_id, organization_id } = req.body;
      if (!organization_id) return res.status(400).json({ error: 'organization_id is required' });

      const updatedRecord = await ClassTeachersModel.update(id, { class_id, teacher_id, organization_id });
      if (!updatedRecord) return res.status(404).json({ message: 'Record not found' });
      res.json(updatedRecord);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const { organization_id } = req.auth.organization_id;
      if (!organization_id) return res.status(400).json({ error: 'organization_id is required' });

      const deletedRecord = await ClassTeachersModel.delete(id, organization_id);
      if (!deletedRecord) return res.status(404).json({ message: 'Record not found' });
      res.json({ message: 'Deleted successfully', deletedRecord });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
