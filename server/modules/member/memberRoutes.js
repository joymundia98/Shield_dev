// server/routes/memberRoutes.js

import express from "express";
import { MemberController } from "./memberController.js";
import { verifyJWT } from "../../middleware/auth.js";
import { requirePermission } from "../../middleware/accessControl.js";

const router = express.Router();

router.post("/", MemberController.create);
router.get("/", MemberController.getAll);
router.get("/:id", MemberController.getById);
// router.put("/:id", verifyJWT, requirePermission("member.update"), MemberController.updateMember);
// router.delete("/:id", verifyJWT, requirePermission("member.delete"), MemberController.deleteMember);

export default router;