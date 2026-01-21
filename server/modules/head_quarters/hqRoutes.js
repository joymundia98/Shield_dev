import express from "express";
import HeadquartersController from "./hqController.js";
import {requirePermission} from "../../middleware/accessControl.js"

const router = express.Router();


// HQ management (admin-only)
router.post("/", HeadquartersController.create);
router.get("/", requirePermission("SUPER_ADMIN"), HeadquartersController.getAll);
router.get("/organizations", HeadquartersController.getOrgByHQId);
router.get("/:headquarter_id/organization/:org_id", HeadquartersController.getOrgUnderHQ);
router.get("/:id", requirePermission("HQ_ADMIN"), HeadquartersController.getById);
router.put("/:id", requirePermission("HQ_ADMIN"), HeadquartersController.update);
router.delete("/:id", requirePermission("HQ_ADMIN"), HeadquartersController.delete);

// // HQ oversight
// router.get(
//   "/:id/organizations",
//   authorize("HQ_ADMIN"),
//   HeadquartersController.getOrganizations
// );

export default router;
