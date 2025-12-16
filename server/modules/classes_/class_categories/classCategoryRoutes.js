import express from "express";
import { classCategoryController } from "./classCategoryController.js";

const router = express.Router();

router.post("/", classCategoryController.create);
router.get("/", classCategoryController.getAll);
router.get("/:id", classCategoryController.getById);
router.put("/:id", classCategoryController.update);
router.delete("/:id", classCategoryController.delete);

export default router;
