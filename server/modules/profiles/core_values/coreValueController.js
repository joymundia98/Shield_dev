import CoreValue from './coreValueController.js';

const coreValuesController = {
  async getAll(req, res) {
    try {
      const coreValues = await CoreValue.getAll();
      res.json({ data: coreValues });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch core values' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const coreValue = await CoreValue.getById(id);
      if (!coreValue) return res.status(404).json({ error: 'Core value not found' });
      res.json(coreValue);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch core value' });
    }
  },

  async getByChurchId(req, res) {
    try {
      const { church_id } = req.params;
      const coreValues = await CoreValue.getByChurchId(church_id);
      res.json({ data: coreValues });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch core values for church' });
    }
  },

  async create(req, res) {
    try {
      const coreValue = await CoreValue.create(req.body);
      res.status(201).json(coreValue);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create core value' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const coreValue = await CoreValue.update(id, req.body);
      if (!coreValue) return res.status(404).json({ error: 'Core value not found' });
      res.json(coreValue);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update core value' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const coreValue = await CoreValue.delete(id);
      if (!coreValue) return res.status(404).json({ error: 'Core value not found' });
      res.json({ message: 'Core value deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete core value' });
    }
  }
};

export default coreValuesController;
