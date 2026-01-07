import express from "express";
import RolesController from "./roleController.js";
import { verifyJWT } from "../../middleware/auth.js";

const router = express.Router();

router.get("/org", RolesController.getAllOrgRoles);
router.post("/", verifyJWT, RolesController.create);
router.get("/",verifyJWT, RolesController.getAll);
router.get("/:id",verifyJWT, RolesController.getOne);
router.put("/:id",verifyJWT, RolesController.update);
router.delete("/:id",verifyJWT, RolesController.delete);

export default router;
