import express from "express";
import RolePermissionsController from "./rolePermissionController.js";

const router = express.Router();


router.post("/assign", RolePermissionsController.assign);


router.delete(
  "/remove",
  RolePermissionsController.remove
);


router.get("/role/:role_id", RolePermissionsController.getPermissions);

router.get("/", RolePermissionsController.getAllRolePermissions);


router.get("/permission/:permission_id", RolePermissionsController.getRoles);

export default router;
