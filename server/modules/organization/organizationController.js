// controllers/organization.controller.js

import Organization from "./organizationModel.js";

export const OrganizationController = {
  // CREATE ORGANIZATION
  async create(req, res) {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Organization name is required" });
      }

      const org = await Organization.create(req.body);
      res.status(201).json(org);

    } catch (err) {
      console.error("Organization create error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // GET BY ID
  async getById(req, res) {
    try {
      const org = await Organization.getById(req.params.id);

      if (!org) {
        return res.status(404).json({ message: "Organization not found" });
      }

      res.json(org);

    } catch (err) {
      console.error("Get org error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // LIST ALL
  async list(req, res) {
    try {
      const organizations = await Organization.getAll();
      res.json(organizations);

    } catch (err) {
      console.error("List org error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // UPDATE
  async update(req, res) {
    try {
      const org = await Organization.update(req.params.id, req.body);

      if (!org) {
        return res.status(404).json({ message: "Organization not found" });
      }

      res.json(org);

    } catch (err) {
      console.error("Update org error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // DELETE
  async delete(req, res) {
    try {
      const deleted = await Organization.delete(req.params.id);

      if (!deleted) {
        return res.status(404).json({ message: "Organization not found" });
      }

      res.json({ message: "Organization deleted", deleted });

    } catch (err) {
      console.error("Delete org error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
};
