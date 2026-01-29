import express from "express";
import HeadquartersController from "./hqController.js";
import { requirePermission } from "../../middleware/accessControl.js";
import { OrganizationController } from "../organization/organizationController.js";

const router = express.Router();

// HQ management
router.post("/", HeadquartersController.create);

router.post("/organizations", OrganizationController.create);
router.get("/", requirePermission("SUPER_ADMIN"), HeadquartersController.getAll);

// Get all orgs under an HQ
router.get("/organizations/:id", HeadquartersController.getOrganizationsByHQId);

// Get a specific org under an HQ
router.get("/:headquarter_id/organizations/:org_id", HeadquartersController.getOrgUnderHQ);

// Get users under specific org under HQ
router.get(
  "/:headquarter_id/organizations/:org_id/users",
  HeadquartersController.getUsersByHQAndOrg
);

router.get(
  "/:headquarter_id/members",
  HeadquartersController.getMembersByHQId
);

router.get(
  "/:headquarter_id/donors",
  HeadquartersController.getDonorsByHQId
);


router.get(
  "/:headquarter_id/organizations/:org_id/members",
  HeadquartersController.getMembersByHQAndOrg
);

router.get("/:id/users", HeadquartersController.getUsersByHQId);

// HQ CRUD
router.get("/:id", requirePermission("HQ_ADMIN"), HeadquartersController.getById);
router.put("/:id", requirePermission("HQ_ADMIN"), HeadquartersController.update);

router.get(
  "/organizations/:org_id/converts",
  HeadquartersController.getConvertsByOrganization
);

router.get(
  "/:hq_id/organizations/:org_id/converts",
  HeadquartersController.getConvertsByHQAndOrg
);



router.get(
  "/:headquarter_id/departments",
  HeadquartersController.getDepartmentsByHQ
);

router.get(
  "/:headquarter_id/donations",
  HeadquartersController.getDonationsByHQ
);

router.get(
  "/:headquarter_id/organizations/:org_id/donations",
  HeadquartersController.getDonationsByHQAndOrg
);


router.get(
  "/:headquarter_id/organizations/:org_id/departments",
  HeadquartersController.getDepartmentsByHQAndOrg
);

router.get(
  "/:headquarter_id/organizations/:org_id/ministries",
  HeadquartersController.getMinistriesByHQAndOrg
);


router.get(
  "/:headquarter_id/ministries",
  HeadquartersController.getMinistriesByHQId
);

router.get(
  "/:headquarter_id/programs",
  HeadquartersController.getProgramsByHQId
);

router.get(
  "/:headquarter_id/organizations/:org_id/programs",
  HeadquartersController.getProgramsByHQAndOrg
);

router.delete("/:id", requirePermission("HQ_ADMIN"), HeadquartersController.delete);

export default router;
