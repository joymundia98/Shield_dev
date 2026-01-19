import express from "express";
import { convertsController } from "./convertController.js";
import { verifyJWT } from "../../middleware/auth.js";

const router = express.Router();

/**
 * IMPORTANT:
 * All routes assume `req.user.organization_id`
 * is injected by auth middleware
 */
router.use(verifyJWT);
// Filters (must come BEFORE :id)
router.get("/member/:member_id", convertsController.getByMember);
router.get("/visitor/:visitor_id", convertsController.getByVisitor);

// Core CRUD
router.get("/", convertsController.getAll);
router.get("/:id", convertsController.getById);
router.post("/", convertsController.create);
router.patch("/:id", convertsController.update);
router.delete("/:id", convertsController.delete);

export default router;
