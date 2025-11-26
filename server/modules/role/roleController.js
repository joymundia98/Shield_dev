// modules/roles/roles.controller.js
import RolesModel from "./roleModel.js";

const RolesController = {
  async create(req, res) {
    try {
      const role = await RolesModel.create(req.body);
      return res.status(201).json(role);
    } catch (error) {
      console.error("Create Role Error:", error);
      return res.status(500).json({ message: "Error creating role" });
    }
  },

  async getAll(req, res) {
    try {
      const roles = await RolesModel.findAll();
      return res.status(200).json(roles);
    } catch (error) {
      console.error("Get Roles Error:", error);
      return res.status(500).json({ message: "Error fetching roles" });
    }
  },

  async getOne(req, res) {
    try {
      const { id } = req.params;
      const role = await RolesModel.findById(id);

      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }

      return res.status(200).json(role);
    } catch (error) {
      console.error("Get Role Error:", error);
      return res.status(500).json({ message: "Error fetching role" });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const role = await RolesModel.update(id, req.body);

      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }

      return res.status(200).json(role);
    } catch (error) {
      console.error("Update Role Error:", error);
      return res.status(500).json({ message: "Error updating role" });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await RolesModel.delete(id);

      if (!deleted) {
        return res.status(404).json({ message: "Role not found" });
      }

      return res.status(200).json({ message: "Role deleted" });
    } catch (error) {
      console.error("Delete Role Error:", error);
      return res.status(500).json({ message: "Error deleting role" });
    }
  }
};

export default RolesController;
