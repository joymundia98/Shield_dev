import AssetDepreciation from "./assetDepreciation.js";

const AssetDepreciationController = {

  // GET all depreciation records for the organization
  async getAll(req, res) {
    try {
      const data = await AssetDepreciation.getAll(req.auth.organization_id);
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch depreciation records" });
    }
  },

  // GET a single depreciation record by ID (organization scoped)
  async getById(req, res) {
    try {
      const { id } = req.params;
      const data = await AssetDepreciation.getById(id, req.auth.organization_id);

      if (!data) return res.status(404).json({ message: "Depreciation record not found" });

      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch depreciation record" });
    }
  },

  // CREATE a new depreciation record (organization scoped)
  async create(req, res) {
    try {
      const data = await AssetDepreciation.create({
        ...req.body,
        organization_id: req.auth.organization_id,
      });
      res.status(201).json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create depreciation record" });
    }
  },

  // UPDATE a depreciation record (organization scoped)
  async update(req, res) {
    try {
      const { id } = req.params;
      const existing = await AssetDepreciation.getById(id, req.auth.organization_id);

      if (!existing) return res.status(404).json({ message: "Depreciation record not found" });

      const updated = await AssetDepreciation.update(id, req.auth.organization_id, req.body);
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update depreciation record" });
    }
  },

  // DELETE a depreciation record (organization scoped)
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await AssetDepreciation.delete(id, req.auth.organization_id);

      if (!deleted) return res.status(404).json({ message: "Depreciation record not found" });

      res.json({ message: "Depreciation record deleted successfully", data: deleted });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete depreciation record" });
    }
  }
};

export default AssetDepreciationController;
