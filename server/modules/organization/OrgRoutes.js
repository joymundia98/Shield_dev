// server/modules/organization/OrgRoutes.js

import express from "express";
import { OrganizationController } from "./organizationController.js";
import { loginOrg } from "../auth/authController.js"
import { createOrg } from "../auth/authController.js";
import { verifyJWT } from "../../middleware/auth.js";
import { requirePermission } from "../../middleware/accessControl.js";

const router = express.Router();

// =====================
// Protected routes (require JWT & permissions)
// =====================

// Create a new organization
router.post("/register", OrganizationController.create);

router.post("/login", OrganizationController.login);

router.post("/organization/login", loginOrg)

router.get("/", OrganizationController.list);

// Get organization by ID
router.get(
  "/:id",
  verifyJWT,
  // requirePermission("organization.view"),
  OrganizationController.getById
);

// Update organization
router.put(
  "/:id",
  verifyJWT,
  requirePermission("organization.update"),
  OrganizationController.update
);

// Delete organization
router.delete(
  "/:id",
  verifyJWT,
  requirePermission("organization.delete"),
  OrganizationController.delete
);

// =====================
// Public route for registration form dropdown
// =====================

// This route does NOT require JWT or permissions
router.get("/public", OrganizationController.listPublic);

export default router;
