import express from "express";
import { OrganizationTypeController } from "./orgTypeController.js";

const router = express.Router();

router.post("/", OrganizationTypeController.create);
router.get("/", OrganizationTypeController.getAll);
router.get("/:id", OrganizationTypeController.getById);
router.put("/:id", OrganizationTypeController.update);
router.delete("/:id", OrganizationTypeController.delete);

export default router;
