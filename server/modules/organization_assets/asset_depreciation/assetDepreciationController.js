import AssetDepreciation from "./assetDepreciation.js";

const AssetDepreciationController = {

  async getAll(req, res) {
    try {
      const organization_id = req.auth.organization_id;
      const data = await AssetDepreciation.getAll(organization_id);
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch depreciation records" });
    }
  },

  async getById(req, res) {
    try {
      const { id: depreciation_id } = req.params;
      const organization_id = req.auth.organization_id;

      const data = await AssetDepreciation.getById(depreciation_id, organization_id);

      if (!data) {
        return res.status(404).json({ message: "Depreciation record not found" });
      }

      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch depreciation record" });
    }
  },

  async create(req, res) {
    try {
      const organization_id = req.auth.organization_id;

      const data = await AssetDepreciation.create({
        ...req.body,
        organization_id,
      });

      res.status(201).json(data);

    } catch (err) {
      console.error(err);

      if (err.message.includes("Invalid asset_id")) {
        return res.status(400).json({ error: err.message });
      }

      res.status(500).json({ error: "Failed to create depreciation record" });
    }
  },

  async update(req, res) {
    try {
      const { id: depreciation_id } = req.params;
      const organization_id = req.auth.organization_id;

      const existing = await AssetDepreciation.getById(depreciation_id, organization_id);

      if (!existing) {
        return res.status(404).json({ message: "Depreciation record not found" });
      }

      const updated = await AssetDepreciation.update(depreciation_id, organization_id, req.body);

      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update depreciation record" });
    }
  },

  async delete(req, res) {
    try {
      const { id: depreciation_id } = req.params;
      const organization_id = req.auth.organization_id;

      const deleted = await AssetDepreciation.delete(depreciation_id, organization_id);

      if (!deleted) {
        return res.status(404).json({ message: "Depreciation record not found" });
      }

      res.json({
        message: "Depreciation record deleted successfully",
        data: deleted
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete depreciation record" });
    }
  }
};

export default AssetDepreciationController;