import express from "express";
import { verifyJWT } from "../../middleware/auth.js";
import { programController } from "./programController.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/", programController.getAll);
router.get("/:id", programController.getById);
router.post("/", programController.create);
router.put("/:id", programController.update);
router.delete("/:id", programController.delete);

export default router;
