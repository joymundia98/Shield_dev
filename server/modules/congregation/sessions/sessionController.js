import Session from "./sessionModel.js";

const SessionsController = {
  async getAll(req, res) {
    try {
      const data = await Session.getAll();
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const data = await Session.getById(id);
      if (!data) return res.status(404).json({ message: "Session not found" });
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const data = await Session.create(req.body);
      return res.status(201).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const existing = await Session.getById(id);
      if (!existing) return res.status(404).json({ message: "Session not found" });
      const updated = await Session.update(id, req.body);
      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Session.delete(id);
      if (!deleted) return res.status(404).json({ message: "Session not found" });
      return res.json({ message: "Session deleted successfully" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};

export default SessionsController;
