// routes/authRoutes.js
import express from "express";
import { login, register } from "./authController.js";
import { verifyJWT } from "../../middleware/auth.js";
import { requirePermission } from "../../middleware/accessControl.js";

const router = express.Router();

// =============================
// AUTH ROUTES
// =============================

// Login (Public)
router.post("/login", login);

// Register User (Public OR you can protect it if needed)
router.post("/register", register);

// Register Organization (Protected + Permission required)
// router.post(
//   "/organizations/register",
//   verifyJWT,                          // Must be logged in
//   requirePermission("organization.create"), // Must have permission
//   registerOrganization
// );

export default router;
