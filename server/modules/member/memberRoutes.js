// server/routes/memberRoutes.js

import express from "express";
import { MemberController } from "../controllers/memberController.js";
import { verifyJWT } from "../../middleware/auth.js";
import { requirePermission } from "../../middleware/accessControl.js";

const router = express.Router();

router.post("/", verifyJWT, requirePermission("member.create"), MemberController.create);
router.get("/", verifyJWT, requirePermission("member.list"), MemberController.list);
router.get("/:id", verifyJWT, requirePermission("member.view"), MemberController.getById);
// router.put("/:id", verifyJWT, requirePermission("member.update"), MemberController.updateMember);
// router.delete("/:id", verifyJWT, requirePermission("member.delete"), MemberController.deleteMember);

export default router;