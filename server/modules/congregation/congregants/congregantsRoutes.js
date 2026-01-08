import express from "express";
import CongregantController from "./congregantsController.js";
import { verifyJWT } from "../../../middleware/auth.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/", CongregantController.getAll);
router.get("/:id", CongregantController.getById);
router.post("/", CongregantController.create);
router.put("/:id", CongregantController.update);
router.delete("/:id", CongregantController.delete);

export default router;