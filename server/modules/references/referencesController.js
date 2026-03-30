import { Reference } from "./references.js";

export const ReferenceController = {

  async create(req, res) {
    try {
      const { type } = req.body;

      const ref = await Reference.create({ type });

      return res.status(201).json(ref);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async getAll(req, res) {
    try {
      const refs = await Reference.getAll();
      return res.json(refs);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const ref = await Reference.getById(req.params.id);

      if (!ref) {
        return res.status(404).json({ error: "Not found" });
      }

      return res.json(ref);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      await Reference.delete(req.params.id);

      return res.json({ message: "Deleted successfully" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
};