import Ministries from './ministry.js';

const ministriesController = {
  async getAll(req, res) {
    try {
      const ministries = await Ministries.getAll();
      res.json({ data: ministries });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch ministries' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const ministry = await Ministries.getById(id);
      if (!ministry) return res.status(404).json({ error: 'Ministry not found' });
      res.json(ministry);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch ministry' });
    }
  },

  async getByChurchId(req, res) {
    try {
      const { church_id } = req.params;
      const ministries = await Ministries.getByChurchId(church_id);
      res.json({ data: ministries });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch ministries for church' });
    }
  },

  async create(req, res) {
    try {
      const ministry = await Ministries.create(req.body);
      res.status(201).json(ministry);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create ministry' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const ministry = await Ministries.update(id, req.body);
      if (!ministry) return res.status(404).json({ error: 'Ministry not found' });
      res.json(ministry);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update ministry' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const ministry = await Ministries.delete(id);
      if (!ministry) return res.status(404).json({ error: 'Ministry not found' });
      res.json({ message: 'Ministry deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete ministry' });
    }
  }
};

export default ministriesController;
