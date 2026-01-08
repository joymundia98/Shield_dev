import Session from "./sessionModel.js";

const SessionsController = {
  // Get all sessions for the organization
  async getAll(req, res) {
    try {
      const data = await Session.getAll(req.auth.organization_id);
      return res.json(data);
    } catch (err) {
      console.error("Error fetching sessions:", err);
      return res.status(500).json({ error: err.message });
    }
  },

  // Get a session by ID for the organization
  async getById(req, res) {
    try {
      const { id } = req.params;
      const data = await Session.getById(id, req.auth.organization_id);
      if (!data) return res.status(404).json({ message: "Session not found" });
      return res.json(data);
    } catch (err) {
      console.error("Error fetching session by ID:", err);
      return res.status(500).json({ error: err.message });
    }
  },

  // Create a new session for the organization
  async create(req, res) {
    try {
      const data = await Session.create(req.body, req.auth.organization_id);
      return res.status(201).json(data);
    } catch (err) {
      console.error("Error creating session:", err);
      return res.status(500).json({ error: err.message });
    }
  },

  // Update a session by ID for the organization
  async update(req, res) {
    try {
      const { id } = req.params;
      const existing = await Session.getById(id, req.auth.organization_id);
      if (!existing) return res.status(404).json({ message: "Session not found" });

      const updated = await Session.update(id, req.body, req.auth.organization_id);
      return res.json(updated);
    } catch (err) {
      console.error("Error updating session:", err);
      return res.status(500).json({ error: err.message });
    }
  },

  // Delete a session by ID for the organization
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Session.delete(id, req.auth.organization_id);
      if (!deleted) return res.status(404).json({ message: "Session not found" });
      return res.json({ message: "Session deleted successfully", deleted });
    } catch (err) {
      console.error("Error deleting session:", err);
      return res.status(500).json({ error: err.message });
    }
  }
};

export default SessionsController;
