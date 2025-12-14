import express from "express";
import { DenominationController } from "./denominationController.js";

const router = express.Router();

router.post("/", DenominationController.create);
router.get("/:id", DenominationController.getById);

export default router;
