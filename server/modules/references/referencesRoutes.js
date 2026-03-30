import express from "express";
import { ReferenceController } from "./referencesController.js";

const router = express.Router();

router.post("/", ReferenceController.create);
router.get("/", ReferenceController.getAll);
router.get("/:id", ReferenceController.getById);
router.delete("/:id", ReferenceController.delete);

export default router;