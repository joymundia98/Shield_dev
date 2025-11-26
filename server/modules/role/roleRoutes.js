import express from "express";
import RolesController from "./roleController.js";

const router = express.Router();

router.post("/", RolesController.create);
router.get("/", RolesController.getAll);
router.get("/:id", RolesController.getOne);
router.put("/:id", RolesController.update);
router.delete("/:id", RolesController.delete);

export default router;
