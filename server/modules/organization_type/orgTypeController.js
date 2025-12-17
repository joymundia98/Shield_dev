import OrganizationType from "./orgTypeController.js";

export const OrganizationTypeController = {
  async create(req, res) {
    try {
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Organization type name is required" });
      }

      const type = await OrganizationType.create(name, description);
      res.status(201).json(type);
    } catch (err) {
      console.error("Create org type error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  async getAll(req, res) {
    try {
      const types = await OrganizationType.getAll();
      res.json(types);
    } catch (err) {
      console.error("Get all org types error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  async getById(req, res) {
    try {
      const type = await OrganizationType.getById(req.params.id);
      if (!type) return res.status(404).json({ message: "Organization type not found" });
      res.json(type);
    } catch (err) {
      console.error("Get org type error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  async update(req, res) {
    try {
      const type = await OrganizationType.update(req.params.id, req.body);
      if (!type) return res.status(404).json({ message: "Organization type not found" });
      res.json(type);
    } catch (err) {
      console.error("Update org type error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  async delete(req, res) {
    try {
      const deleted = await OrganizationType.delete(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Organization type not found" });
      res.json({ message: "Organization type deleted", deleted });
    } catch (err) {
      console.error("Delete org type error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
};
