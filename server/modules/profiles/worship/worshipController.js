import WorshipTimes from './worship.js';

const worshipController = {
  async getAll(req, res) {
    try {
      const times = await WorshipTimes.getAll();
      res.json({ data: times });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch worship times' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const time = await WorshipTimes.getById(id);
      if (!time) return res.status(404).json({ error: 'Worship time not found' });
      res.json(time);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch worship time' });
    }
  },

  async getByChurchId(req, res) {
    try {
      const { church_id } = req.params;
      const times = await WorshipTimes.getByChurchId(church_id);
      res.json({ data: times });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch worship times for church' });
    }
  },

  async create(req, res) {
    try {
      const time = await WorshipTimes.create(req.body);
      res.status(201).json(time);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create worship time' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const time = await WorshipTimes.update(id, req.body);
      if (!time) return res.status(404).json({ error: 'Worship time not found' });
      res.json(time);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update worship time' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const time = await WorshipTimes.delete(id);
      if (!time) return res.status(404).json({ error: 'Worship time not found' });
      res.json({ message: 'Worship time deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete worship time' });
    }
  }
};

export default worshipController;
