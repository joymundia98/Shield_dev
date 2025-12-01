// modules/finance/extraFields/extraFieldController.js
import ExtraField from './extraFieldModel.js';

const ExtraFieldController = {
  async list(req, res) {
    try {
      const data = await ExtraField.getAll();
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const created = await ExtraField.create(req.body);
      return res.status(201).json(created);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await ExtraField.delete(id);
      if (!deleted) return res.status(404).json({ message: 'Not found' });
      return res.json({ message: 'Deleted' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};

export default ExtraFieldController;
