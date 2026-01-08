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
        return res.status(400).json({ message: "role_id and permission_id are required" });
      }

      const result = await RolePermissionsModel.assignPermission(
        role_id,
        permission_id,
        organization_id
      );

      if (!result) {
        return res.status(404).json({ message: "Role or permission not found in organization" });
      }

      return res.status(201).json({
        message: "Permission successfully assigned to role",
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
        return res.status(400).json({ message: "role_id and permission_id are required" });
      }

      const result = await RolePermissionsModel.removePermission(
        role_id,
        permission_id,
        organization_id
      );

      if (!result) {
        return res.status(404).json({ message: "Role-permission relation not found" });
      }

      return res.status(200).json({
        message: "Permission successfully removed from role",
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

      if (!role_id) {
        return res.status(400).json({ message: "role_id is required" });
      }

      const permissions = await RolePermissionsModel.getPermissionsByRole(
        role_id,
        organization_id
      );

      return res.status(200).json({ data: permissions });
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

      if (!permission_id) {
        return res.status(400).json({ message: "permission_id is required" });
      }

      const roles = await RolePermissionsModel.getRolesByPermission(
        permission_id,
        organization_id
      );

      return res.status(200).json({ data: roles });
    } catch (error) {
      console.error("Fetch Roles Error:", error);
      return res.status(500).json({ message: "Error fetching roles" });
    }
  },

  // ===============================
  // GET USER ROLE AND PERMISSIONS
  // ===============================
  async getUserRoleAndPermissions(req, res) {
    try {
      const { user_id } = req.params;
      const organization_id = req.auth.organization_id;

      if (!user_id) {
        return res.status(400).json({ message: "user_id is required" });
      }

      const data = await RolePermissionsModel.getUserRoleAndPermissions(
        user_id,
        organization_id
      );

      return res.status(200).json({ data });
    } catch (error) {
      console.error("Fetch User Role & Permissions Error:", error);
      return res.status(500).json({ message: "Error fetching user role and permissions" });
    }
  },

  // ===============================
  // GET ROLE WITH PERMISSIONS
  // ===============================
  async getRoleWithPermissions(req, res) {
    try {
      const { role_id } = req.params;
      const organization_id = req.auth.organization_id;

      if (!role_id) {
        return res.status(400).json({ message: "role_id is required" });
      }

      const role = await RolePermissionsModel.getRoleWithPermissions(
        role_id,
        organization_id
      );

      if (!role) {
        return res.status(404).json({ message: "Role not found in this organization" });
      }

      return res.status(200).json({ data: role });
    } catch (error) {
      console.error("Fetch Role With Permissions Error:", error);
      return res.status(500).json({ message: "Error fetching role with permissions" });
    }
  }
};

export default RolePermissionsController;
