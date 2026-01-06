import RolePermissionsModel from "./rolePermissionModel.js";

const RolePermissionsController = {
  // ===============================
  // ASSIGN PERMISSION TO ROLE
  // ===============================
  async assign(req, res) {
    try {
      const { role_id, permission_id } = req.body;
      const organization_id = req.auth.organization_id;

      if (!role_id || !permission_id) {
        return res.status(400).json({ message: "role_id and permission_id required" });
      }

      const result = await RolePermissionsModel.assignPermission(
        role_id,
        permission_id,
        organization_id
      );

      return res.status(201).json({
        message: "Permission assigned to role",
        data: result,
      });
    } catch (error) {
      console.error("Assign Permission Error:", error);
      return res.status(500).json({ message: "Error assigning permission" });
    }
  },

  // ===============================
  // REMOVE PERMISSION FROM ROLE
  // ===============================
  async remove(req, res) {
    try {
      const { role_id, permission_id } = req.body;
      const organization_id = req.auth.organization_id;

      if (!role_id || !permission_id) {
        return res.status(400).json({ message: "role_id and permission_id required" });
      }

      const result = await RolePermissionsModel.removePermission(
        role_id,
        permission_id,
        organization_id
      );

      if (!result) {
        return res.status(404).json({ message: "Relation not found" });
      }

      return res.status(200).json({
        message: "Permission removed from role",
        data: result,
      });
    } catch (error) {
      console.error("Remove Permission Error:", error);
      return res.status(500).json({ message: "Error removing permission" });
    }
  },

  // ===============================
  // GET PERMISSIONS BY ROLE
  // ===============================
  async getPermissions(req, res) {
    try {
      const { role_id } = req.params;
      const organization_id = req.auth.organization_id;

      const permissions = await RolePermissionsModel.getPermissionsByRole(
        role_id,
        organization_id
      );

      return res.status(200).json(permissions);
    } catch (error) {
      console.error("Fetch Permissions Error:", error);
      return res.status(500).json({ message: "Error fetching permissions" });
    }
  },

  // ===============================
  // GET ROLES BY PERMISSION
  // ===============================
  async getRoles(req, res) {
    try {
      const { permission_id } = req.params;
      const organization_id = req.auth.organization_id;

      const roles = await RolePermissionsModel.getRolesByPermission(
        permission_id,
        organization_id
      );

      return res.status(200).json(roles);
    } catch (error) {
      console.error("Fetch Roles Error:", error);
      return res.status(500).json({ message: "Error fetching roles" });
    }
  },
};

export default RolePermissionsController;
