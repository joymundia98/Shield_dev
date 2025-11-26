import Denomination from "./denominationModel.js";

export const DenominationController = {
  // CREATE
  async create(req, res) {
    try {
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Denomination name is required" });
      }

      const entry = await Denomination.create({ name, description });
      res.status(201).json(entry);

    } catch (err) {
      console.error("Denomination create error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // GET BY ID
  async getById(req, res) {
    try {
      const denomination = await Denomination.getById(req.params.id);

      if (!denomination) {
        return res.status(404).json({ message: "Denomination not found" });
      }

      res.json(denomination);

    } catch (err) {
      console.error("Get denomination error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // LIST ALL
  async list(req, res) {
    try {
      const denominations = await Denomination.getAll();
      res.json(denominations);

    } catch (err) {
      console.error("List denomination error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // UPDATE
  async update(req, res) {
    try {
      const updated = await Denomination.update(req.params.id, req.body);

      if (!updated) {
        return res.status(404).json({ message: "Denomination not found" });
      }

      res.json(updated);

    } catch (err) {
      console.error("Update denomination error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // DELETE
  async delete(req, res) {
    try {
      const deleted = await Denomination.delete(req.params.id);

      if (!deleted) {
        return res.status(404).json({ message: "Denomination not found" });
      }

      res.json({ message: "Denomination deleted", deleted });

    } catch (err) {
      console.error("Delete denomination error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
};
