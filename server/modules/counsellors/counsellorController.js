import CounsellorsModel from "./counsellor.js";

export const counsellorsController = {
  // GET all counsellors (org scoped)
  async getAll(req, res) {
    try {
      const { organization_id } = req.user.organization_id;

      const counsellors = await CounsellorsModel.findAll(organization_id);
      res.json(counsellors);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch counsellors" });
    }
  },

  // GET counsellor by ID (org scoped)
  async getById(req, res) {
    try {
      const { id } = req.params;
      const { organization_id } = req.user.organization_id;

      const counsellor = await CounsellorsModel.findById(id, organization_id);

      if (!counsellor) {
        return res.status(404).json({ error: "Counsellor not found" });
      }

      res.json(counsellor);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch counsellor" });
    }
  },

  // CREATE counsellor (org scoped)
  async create(req, res) {
    try {
      const { organization_id } = req.user.organization_id;
      const data = req.body;

      const newCounsellor = await CounsellorsModel.create(
        data,
        organization_id
      );

      res.status(201).json(newCounsellor);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create counsellor" });
    }
  },

  // UPDATE counsellor (org scoped)
  async update(req, res) {
    try {
      const { id } = req.params;
      const { organization_id } = req.user.organization_id;
      const data = req.body;

      const updatedCounsellor = await CounsellorsModel.update(
        id,
        data,
        organization_id
      );

      if (!updatedCounsellor) {
        return res.status(404).json({ error: "Counsellor not found" });
      }

      res.json(updatedCounsellor);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update counsellor" });
    }
  },

  // DELETE counsellor (org scoped)
  async delete(req, res) {
    try {
      const { id } = req.params;
      const { organization_id } = req.user.organization_id;

      const deleted = await CounsellorsModel.delete(id, organization_id);

      if (!deleted) {
        return res.status(404).json({ error: "Counsellor not found" });
      }

      res.json({ message: "Counsellor deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete counsellor" });
    }
  },
};
