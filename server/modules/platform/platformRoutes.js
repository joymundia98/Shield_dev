import express from "express";
import {
  registerPlatformAdmin,
  loginPlatformAdmin,
  getPlatformAdmins,
  getPlatformAdminById,
  updatePlatformAdmin,
  deletePlatformAdmin,
} from "./platformController.js";

import { verifyPlatformAdmin } from "../../middleware/platformMiddleware.js";

const router = express.Router();

// PUBLIC
router.post("/register", registerPlatformAdmin);
router.post("/login", loginPlatformAdmin);

// PROTECTED
router.get("/", verifyPlatformAdmin, getPlatformAdmins);
router.get("/:id", verifyPlatformAdmin, getPlatformAdminById);
router.put("/:id", verifyPlatformAdmin, updatePlatformAdmin);
router.delete("/:id", verifyPlatformAdmin, deletePlatformAdmin);

export default router;