import Congregant from "./congregantsModel.js";

const CongregantController = {
  async getAll(req, res) {
    try {
      const data = await Congregant.getAll();
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const data = await Congregant.getById(id);
      if (!data) return res.status(404).json({ message: "Congregant not found" });
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const data = await Congregant.create(req.body);
      return res.status(201).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const existing = await Congregant.getById(id);
      if (!existing) return res.status(404).json({ message: "Congregant not found" });

      const updated = await Congregant.update(id, req.body);
      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Congregant.delete(id);
      if (!deleted) return res.status(404).json({ message: "Congregant not found" });
      return res.json({ message: "Congregant deleted successfully" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};

export default CongregantController;
