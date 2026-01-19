import FollowUpsModel from './followUp.js';

export const followUpsController = {
  // GET all follow-ups for the organization
  async getAll(req, res) {
    try {
      const organization_id = req.auth.organization_id;
      const followUps = await FollowUpsModel.findAll(organization_id);
      res.json(followUps);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch follow-ups' });
    }
  },

  // GET follow-up by ID (organization-scoped)
  async getById(req, res) {
    try {
      const { id } = req.params;
      const organization_id = req.auth.organization_id;
      const followUp = await FollowUpsModel.findById(id, organization_id);

      if (!followUp) 
        return res.status(404).json({ error: 'Follow-up not found' });

      res.json(followUp);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch follow-up' });
    }
  },

  // CREATE a new follow-up (organization enforced)
  async create(req, res) {
    try {
      const organization_id = req.auth.organization_id;
      const data = req.body;

      const newFollowUp = await FollowUpsModel.create(data, organization_id);
      res.status(201).json(newFollowUp);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create follow-up' });
    }
  },

  // UPDATE follow-up (organization safe)
  async update(req, res) {
    try {
      const { id } = req.params;
      const organization_id = req.auth.organization_id;
      const data = req.body;

      const updatedFollowUp = await FollowUpsModel.update(id, data, organization_id);
      if (!updatedFollowUp) 
        return res.status(404).json({ error: 'Follow-up not found' });

      res.json(updatedFollowUp);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update follow-up' });
    }
  },

  // DELETE follow-up (organization safe)
  async delete(req, res) {
    try {
      const { id } = req.params;
      const organization_id = req.auth.organization_id;

      const deleted = await FollowUpsModel.delete(id, organization_id);
      if (!deleted) 
        return res.status(404).json({ error: 'Follow-up not found' });

      res.json({ message: 'Follow-up deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete follow-up' });
    }
  },

  // GET follow-ups by visitor (organization scoped)
  async getByVisitor(req, res) {
    try {
      const { visitor_id } = req.params;
      const organization_id = req.auth.organization_id;

      const followUps = await FollowUpsModel.findByVisitor(visitor_id, organization_id);
      res.json(followUps);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch follow-ups for visitor' });
    }
  },
};
