import Donor from "./donorModel.js";

const DonorsController = {
  async getAll(req, res) {
    try {
      const { organization_id } = req.auth.organization_id;

      const data = await Donor.getAll(organization_id);
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const { organization_id } = req.auth.organization_id;

      const data = await Donor.getById(id, organization_id);

      if (!data)
        return res.status(404).json({ message: "Donor not found" });

      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const { organization_id } = req.auth.organization_id;

      const data = await Donor.create({
        ...req.body,
        organization_id,
      });

      return res.status(201).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { organization_id } = req.auth.organization_id;

      const existing = await Donor.getById(id, organization_id);
      if (!existing)
        return res.status(404).json({ message: "Donor not found" });

      const updated = await Donor.update(id, organization_id, req.body);
      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const { organization_id } = req.auth.organization_id;

      const deleted = await Donor.delete(id, organization_id);

      if (!deleted)
        return res.status(404).json({ message: "Donor not found" });

      return res.json({ message: "Donor deleted successfully" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
};

export default DonorsController;
