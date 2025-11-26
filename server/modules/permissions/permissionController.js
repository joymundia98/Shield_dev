// controllers/permission.controller.js

import Permission from "./permissionModel.js";

export const PermissionController = {
  // CREATE
  async create(req, res) {
    try {
      const { name, path, method } = req.body;

      if (!name || !path || !method) {
        return res.status(400).json({
          message: "name, path and method are required"
        });
      }

      const permission = await Permission.create(req.body);
      res.status(201).json(permission);

    } catch (err) {
      console.error("Permission create error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // LIST ALL
  async list(req, res) {
    try {
      const permissions = await Permission.getAll();
      res.json(permissions);

    } catch (err) {
      console.error("Permission list error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // GET BY ID
  async getById(req, res) {
    try {
      const permission = await Permission.getById(req.params.id);

      if (!permission) {
        return res.status(404).json({ message: "Permission not found" });
      }

      res.json(permission);

    } catch (err) {
      console.error("Permission fetch error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // UPDATE
  async update(req, res) {
    try {
      const updated = await Permission.update(req.params.id, req.body);

      if (!updated) {
        return res.status(404).json({ message: "Permission not found" });
      }

      res.json(updated);

    } catch (err) {
      console.error("Permission update error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // DELETE
  async delete(req, res) {
    try {
      const deleted = await Permission.delete(req.params.id);

      if (!deleted) {
        return res.status(404).json({ message: "Permission not found" });
      }

      res.json({ message: "Permission deleted", deleted });

    } catch (err) {
      console.error("Permission delete error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
};
