import express from "express";
import HeadquartersController from "./hqController.js";
import { requirePermission } from "../../middleware/accessControl.js";
import { OrganizationController } from "../organization/organizationController.js";
import { verifyJWT } from "../../middleware/auth.js";

const router = express.Router();

// HQ management
router.post("/", HeadquartersController.create);

router.post("/organizations", verifyJWT, OrganizationController.create);
router.get("/", HeadquartersController.getAll);

router.get("/names", HeadquartersController.getAllByName);

// Get all orgs under an HQ
router.get("/organizations/:id", verifyJWT, HeadquartersController.getOrganizationsByHQId);

// Get a specific org under an HQ
router.get("/:headquarter_id/organizations/:org_id", verifyJWT, HeadquartersController.getOrgUnderHQ);

// Get users under specific org under HQ
router.get(
  "/:headquarter_id/organizations/:org_id/users", verifyJWT,
  HeadquartersController.getUsersByHQAndOrg
);

router.get(
  "/:headquarter_id/members", verifyJWT,
  HeadquartersController.getMembersByHQId
);

router.get(
  "/:headquarter_id/donors", verifyJWT,
  HeadquartersController.getDonorsByHQId
);

router.get("/:headquarter_id/incomes", verifyJWT, HeadquartersController.getIncomeByHQId);

router.get(
  "/:hq_id/visitors", verifyJWT,
  HeadquartersController.getVisitorsByHQId
);


router.get(
  "/:headquarter_id/organizations/:org_id/members", verifyJWT,
  HeadquartersController.getMembersByHQAndOrg
);

router.get("/:id/users", verifyJWT, HeadquartersController.getUsersByHQId);

// HQ CRUD
router.get("/:id", HeadquartersController.getById);


router.put("/:id", requirePermission("HQ_ADMIN"), HeadquartersController.update);

router.get(
  "/organizations/:org_id/converts",
  HeadquartersController.getConvertsByOrganization
);

router.get(
  "/:headquarter_id/converts", verifyJWT,
  HeadquartersController.getConvertsByHQ
);

router.get(
  "/:hq_id/organizations/:org_id/converts", verifyJWT,
  HeadquartersController.getConvertsByHQAndOrg
);



router.get(
  "/:headquarter_id/departments", verifyJWT,
  HeadquartersController.getDepartmentsByHQ
);

router.get(
  "/:headquarter_id/donations", verifyJWT,
  HeadquartersController.getDonationsByHQ
);

router.get(
  "/:headquarter_id/organizations/:org_id/donations", verifyJWT,
  HeadquartersController.getDonationsByHQAndOrg
);


router.get(
  "/:headquarter_id/attendance_records", verifyJWT,
  HeadquartersController.getAttendanceRecByHQ
);


router.get(
  "/:headquarter_id/organizations/:org_id/departments", verifyJWT,
  HeadquartersController.getDepartmentsByHQAndOrg
);

router.get(
  "/:headquarter_id/organizations/:org_id/ministries", verifyJWT,
  HeadquartersController.getMinistriesByHQAndOrg
);


router.get(
  "/:headquarter_id/ministries", verifyJWT,
  HeadquartersController.getMinistriesByHQId
);

router.get(
  "/:headquarter_id/programs", verifyJWT,
  HeadquartersController.getProgramsByHQId
);

router.get(
  "/:headquarter_id/organizations/:org_id/programs", verifyJWT,
  HeadquartersController.getProgramsByHQAndOrg
);

router.delete("/:id", requirePermission("HQ_ADMIN"), HeadquartersController.delete);

export default router;
