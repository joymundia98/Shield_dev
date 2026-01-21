import express from "express";
import HeadquartersController from "./hqController.js";
import { requirePermission } from "../../middleware/accessControl.js";

const router = express.Router();

// HQ management
router.post("/", HeadquartersController.create);
router.get("/", requirePermission("SUPER_ADMIN"), HeadquartersController.getAll);

// Get all orgs under an HQ
router.get("/organizations/:id", HeadquartersController.getOrganizationsByHQId);

// Get a specific org under an HQ
router.get("/:headquarter_id/organization/:org_id", HeadquartersController.getOrgUnderHQ);

// HQ CRUD
router.get("/:id", requirePermission("HQ_ADMIN"), HeadquartersController.getById);
router.put("/:id", requirePermission("HQ_ADMIN"), HeadquartersController.update);
router.delete("/:id", requirePermission("HQ_ADMIN"), HeadquartersController.delete);

export default router;
