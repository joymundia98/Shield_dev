// routes/permission.routes.js

import express from "express";
import { PermissionController } from "./permissionController.js";
import { verifyJWT } from "../../middleware/auth.js";
import { requirePermission } from "../../middleware/accessControl.js";

const router = express.Router();

// CREATE
router.post(
  "/",
  verifyJWT,
  requirePermission("permissions.create"),
  PermissionController.create
);

// LIST
router.get(
  "/",
  verifyJWT,
  PermissionController.list
);

// GET ONE
router.get(
  "/:id",
  verifyJWT,
  requirePermission("permissions.view"),
  PermissionController.getById
);

// UPDATE
router.put(
  "/:id",
  verifyJWT,
  requirePermission("permissions.update"),
  PermissionController.update
);

// DELETE
router.delete(
  "/:id",
  verifyJWT,
  requirePermission("permissions.delete"),
  PermissionController.delete
);

export default router;
