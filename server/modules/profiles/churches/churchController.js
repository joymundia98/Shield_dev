import Church from './church.js';

const churchController = {
  async getAll(req, res) {
    try {
      const churches = await Church.getAll();
      res.json({ data: churches });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch churches' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const church = await Church.getById(id);
      if (!church) return res.status(404).json({ error: 'Church not found' });
      res.json(church);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch church' });
    }
  },

  async create(req, res) {
    try {
      const church = await Church.create(req.body);
      res.status(201).json(church);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create church' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const church = await Church.update(id, req.body);
      if (!church) return res.status(404).json({ error: 'Church not found' });
      res.json(church);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update church' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const church = await Church.delete(id);
      if (!church) return res.status(404).json({ error: 'Church not found' });
      res.json({ message: 'Church deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete church' });
    }
  }
};

export default churchController;
