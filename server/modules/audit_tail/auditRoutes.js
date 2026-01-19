// routes/auditRoutes.js
import express from "express";
import AuditController from "./auditController.js";
import { verifyJWT } from "../../middleware/auth.js";

const router = express.Router();
router.use(verifyJWT);

router.get("/", AuditController.getLogs); // Fetch audit logs

export default router;
