import AssetDepreciation from "./assetDepreciation.js";

const AssetDepreciationController = {
  async getAll(req, res) {
    try {
      const data = await AssetDepreciation.getAll();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const data = await AssetDepreciation.getById(id);

      if (!data) return res.status(404).json({ message: "Depreciation record not found" });

      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const data = await AssetDepreciation.create(req.body);
      res.status(201).json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const existing = await AssetDepreciation.getById(id);

      if (!existing) return res.status(404).json({ message: "Depreciation record not found" });

      const updated = await AssetDepreciation.update(id, req.body);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await AssetDepreciation.delete(id);

      if (!deleted) return res.status(404).json({ message: "Depreciation record not found" });

      res.json({ message: "Depreciation record deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

export default AssetDepreciationController;
