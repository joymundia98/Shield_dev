import FollowUpsModel from './followUp.js';

export const followUpsController = {
  async getAll(req, res) {
    try {
      const followUps = await FollowUpsModel.findAll();
      res.json(followUps);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch follow-ups' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const followUp = await FollowUpsModel.findById(id);
      if (!followUp) return res.status(404).json({ error: 'Follow-up not found' });
      res.json(followUp);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch follow-up' });
    }
  },

  async create(req, res) {
    try {
      const data = req.body;
      const newFollowUp = await FollowUpsModel.create(data);
      res.status(201).json(newFollowUp);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create follow-up' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const updatedFollowUp = await FollowUpsModel.update(id, data);
      if (!updatedFollowUp) return res.status(404).json({ error: 'Follow-up not found' });
      res.json(updatedFollowUp);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update follow-up' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      await FollowUpsModel.delete(id);
      res.json({ message: 'Follow-up deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete follow-up' });
    }
  },

  async getByMember(req, res) {
    try {
      const { member_id } = req.params;
      const followUps = await FollowUpsModel.findByMember(member_id);
      res.json(followUps);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch follow-ups for member' });
    }
  },
};
