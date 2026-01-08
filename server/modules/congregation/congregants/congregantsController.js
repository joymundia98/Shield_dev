import Congregant from "./congregantsModel.js";

const CongregantController = {
  // GET ALL (organization scoped)
  async getAll(req, res) {
    try {
      const organization_id = req.auth.organization_id;

      const data = await Congregant.getAll(organization_id);
      return res.json(data);
    } catch (err) {
      console.error("Error fetching congregants:", err);
      return res.status(500).json({ error: err.message });
    }
  },

  // GET BY ID (organization scoped)
  async getById(req, res) {
    try {
      const { id } = req.params;
      const organization_id = req.auth.organization_id;

      const data = await Congregant.getById(id, organization_id);
      if (!data) {
        return res.status(404).json({ message: "Congregant not found" });
      }

      return res.json(data);
    } catch (err) {
      console.error("Error fetching congregant by id:", err);
      return res.status(500).json({ error: err.message });
    }
  },

  // CREATE (organization enforced)
  async create(req, res) {
    try {
      const organization_id = req.auth.organization_id;

      const data = await Congregant.create(req.body, organization_id);
      return res.status(201).json(data);
    } catch (err) {
      console.error("Error creating congregant:", err);
      return res.status(500).json({ error: err.message });
    }
  },

  // UPDATE (organization safe)
  async update(req, res) {
    try {
      const { id } = req.params;
      const organization_id = req.auth.organization_id;

      const existing = await Congregant.getById(id, organization_id);
      if (!existing) {
        return res.status(404).json({ message: "Congregant not found" });
      }

      const updated = await Congregant.update(id, organization_id, req.body);
      return res.json(updated);
    } catch (err) {
      console.error("Error updating congregant:", err);
      return res.status(500).json({ error: err.message });
    }
  },

  // DELETE (organization safe)
  async delete(req, res) {
    try {
      const { id } = req.params;
      const organization_id = req.auth.organization_id;

      const deleted = await Congregant.delete(id, organization_id);
      if (!deleted) {
        return res.status(404).json({ message: "Congregant not found" });
      }

      return res.json({ message: "Congregant deleted successfully" });
    } catch (err) {
      console.error("Error deleting congregant:", err);
      return res.status(500).json({ error: err.message });
    }
  }
};

export default CongregantController;
