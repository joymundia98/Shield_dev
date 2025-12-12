import Leadership from './leadership.js';

const leadershipController = {
  async getAll(req, res) {
    try {
      const leaders = await Leadership.getAll();
      res.json({ data: leaders });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch leadership members' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const leader = await Leadership.getById(id);
      if (!leader) return res.status(404).json({ error: 'Leadership member not found' });
      res.json(leader);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch leadership member' });
    }
  },

  async getByChurchId(req, res) {
    try {
      const { church_id } = req.params;
      const leaders = await Leadership.getByChurchId(church_id);
      res.json({ data: leaders });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch leadership members for church' });
    }
  },

  async create(req, res) {
    try {
      const leader = await Leadership.create(req.body);
      res.status(201).json(leader);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create leadership member' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const leader = await Leadership.update(id, req.body);
      if (!leader) return res.status(404).json({ error: 'Leadership member not found' });
      res.json(leader);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update leadership member' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const leader = await Leadership.delete(id);
      if (!leader) return res.status(404).json({ error: 'Leadership member not found' });
      res.json({ message: 'Leadership member deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete leadership member' });
    }
  }
};

export default leadershipController;
