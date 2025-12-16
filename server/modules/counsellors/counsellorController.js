import CounsellorsModel from './counsellor.js';

export const counsellorsController = {
  async getAll(req, res) {
    try {
      const counsellors = await CounsellorsModel.findAll();
      res.json(counsellors);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch counsellors' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const counsellor = await CounsellorsModel.findById(id);
      if (!counsellor) return res.status(404).json({ error: 'Counsellor not found' });
      res.json(counsellor);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch counsellor' });
    }
  },

  async create(req, res) {
    try {
      const data = req.body;
      const newCounsellor = await CounsellorsModel.create(data);
      res.status(201).json(newCounsellor);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create counsellor' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const updatedCounsellor = await CounsellorsModel.update(id, data);
      if (!updatedCounsellor) return res.status(404).json({ error: 'Counsellor not found' });
      res.json(updatedCounsellor);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update counsellor' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      await CounsellorsModel.delete(id);
      res.json({ message: 'Counsellor deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete counsellor' });
    }
  },
};
