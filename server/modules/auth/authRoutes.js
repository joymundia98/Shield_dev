// routes/authRoutes.js
import express from "express";
import { login, register, loginOrg, createOrg, headQuarterLogin, headQuarterRegister } from "./authController.js";
import { verifyJWT } from "../../middleware/auth.js";
import { requirePermission } from "../../middleware/accessControl.js";

const router = express.Router();

// =============================
// AUTH ROUTES
// =============================
router.post(
  "/organizations/register", createOrg
);

// Login (Public)
router.post("/login", login);

// Register User (Public OR you can protect it if needed)
router.post("/register", register);

router.post("/organiazations/login", loginOrg);

router.post("/hq/register", headQuarterRegister);

router.post("/hq/login", headQuarterLogin);

// Register Organization (Protected + Permission required)


export default router;
