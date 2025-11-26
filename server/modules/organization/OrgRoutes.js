// routes/organization.routes.js

import express from "express";
import { OrganizationController } from "./organizationController.js";
import { verifyJWT } from "../../middleware/auth.js";
import { requirePermission } from "../../middleware/accessControl.js";

const router = express.Router();

router.post(
  "/",
  verifyJWT,
  requirePermission("organization.create"),
  OrganizationController.create
);

router.get(
  "/",
  verifyJWT,
  requirePermission("organization.list"),
  OrganizationController.list
);

router.get(
  "/:id",
  verifyJWT,
  requirePermission("organization.view"),
  OrganizationController.getById
);

router.put(
  "/:id",
  verifyJWT,
  requirePermission("organization.update"),
  OrganizationController.update
);

router.delete(
  "/:id",
  verifyJWT,
  requirePermission("organization.delete"),
  OrganizationController.delete
);

export default router;
