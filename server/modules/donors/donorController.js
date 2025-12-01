import Donor from "./donorModel.js";

const DonorsController = {
  async getAll(req, res) {
    try {
      const data = await Donor.getAll();
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const data = await Donor.getById(id);

      if (!data)
        return res.status(404).json({ message: "Donor not found" });

      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const data = await Donor.create(req.body);
      return res.status(201).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const existing = await Donor.getById(id);

      if (!existing)
        return res.status(404).json({ message: "Donor not found" });

      const updated = await Donor.update(id, req.body);
      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      const deleted = await Donor.delete(id);

      if (!deleted)
        return res.status(404).json({ message: "Donor not found" });

      return res.json({ message: "Donor deleted successfully" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};

export default DonorsController;