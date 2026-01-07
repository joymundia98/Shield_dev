// modules/roles/roles.controller.js
import Department from "../hr/departments/departmentModel.js";
import RolesModel from "./roleModel.js";

const RolesController = {
  async create(req, res) {
    try {
      const organization_id = req.auth.organization_id;
      const { department_id } = req.body;

      // 🔒 Validate department belongs to this org
      const department = await Department.getById(
        department_id,
        organization_id
      );

      if (!department) {
        return res.status(404).json({
          message: "Department not found in your organization",
        });
      }

      const role = await RolesModel.create({
        ...req.body,
        organization_id,
      });

      return res.status(201).json(role);
    } catch (error) {
      console.error("Create Role Error:", error);
      return res.status(500).json({ message: "Error creating role" });
    }
  },


  async getAll(req, res) {
    try {
      const { organization_id } = req.auth;

      const roles = await RolesModel.findAll(organization_id);

      return res.status(200).json(roles);
    } catch (error) {
      console.error("Get Roles Error:", error);
      return res.status(500).json({ message: "Error fetching roles" });
    }
  },

  async getOne(req, res) {
    try {
      const { id } = req.params;
      const organization_id = req.auth.organization_id
      const role = await RolesModel.findById(id, organization_id);

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
      const organization_id = req.auth.organization_id
      const role = await RolesModel.update(id, organization_id, req.body);

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
      const organization_id = req.auth.organization_id
      const deleted = await RolesModel.delete(id, organization_id);

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
