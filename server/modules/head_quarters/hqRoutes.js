import express from "express";
import HeadquartersController from "./hqController.js";
import authenticate from "../../middleware/authenticate.js";
import requirePermission from "../../middleware/accessControl.js"

const router = express.Router();

// Protect all HQ routes
router.use(authenticate);

// HQ management (admin-only)
router.post("/", HeadquartersController.create);
router.get("/", requirePermission("SUPER_ADMIN"), HeadquartersController.getAll);
router.get("/:id", requirePermission("HQ_ADMIN"), HeadquartersController.getById);
router.put("/:id", requirePermission("HQ_ADMIN"), HeadquartersController.update);
router.delete("/:id", requirePermission("HQ_ADMIN"), HeadquartersController.delete);

// HQ oversight
router.get(
  "/:id/organizations",
  authorize("HQ_ADMIN"),
  HeadquartersController.getOrganizations
);

export default router;
