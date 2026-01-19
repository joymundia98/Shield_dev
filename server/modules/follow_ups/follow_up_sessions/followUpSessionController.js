import FollowUpSessionsModel from './followUpSession.js';

export const followUpSessionsController = {
  async getAll(req, res) {
    try {
      const organization_id = req.auth.organization_id;
      const sessions = await FollowUpSessionsModel.findAll(organization_id);
      res.json(sessions);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch follow-up sessions' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const organization_id = req.auth.organization_id;
      const session = await FollowUpSessionsModel.findById(id, organization_id);
      if (!session) return res.status(404).json({ error: 'Session not found' });
      res.json(session);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch session' });
    }
  },

  async create(req, res) {
    try {
      const organization_id = req.auth.organization_id;
      const data = req.body;
      const newSession = await FollowUpSessionsModel.create(data, organization_id);
      res.status(201).json(newSession);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create session' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const organization_id = req.auth.organization_id;
      const data = req.body;
      const updatedSession = await FollowUpSessionsModel.update(id, data, organization_id);
      if (!updatedSession) return res.status(404).json({ error: 'Session not found' });
      res.json(updatedSession);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update session' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const organization_id = req.auth.organization_id;
      const deleted = await FollowUpSessionsModel.delete(id, organization_id);
      if (!deleted) return res.status(404).json({ error: 'Session not found' });
      res.json({ message: 'Session deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete session' });
    }
  },

  async getByCounsellor(req, res) {
    try {
      const { counsellor_id } = req.params;
      const organization_id = req.auth.organization_id;
      const sessions = await FollowUpSessionsModel.findByCounsellor(counsellor_id, organization_id);
      res.json(sessions);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch sessions for counsellor' });
    }
  },

  async getBySession(req, res) {
    try {
      const { session_id } = req.params;
      const organization_id = req.auth.organization_id;
      const sessions = await FollowUpSessionsModel.findBySession(session_id, organization_id);
      res.json(sessions);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch sessions for session_id' });
    }
  },
};
