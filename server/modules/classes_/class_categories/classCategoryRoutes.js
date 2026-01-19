import express from "express";
import { classCategoryController } from "./classCategoryController.js";
import { verifyJWT } from "../../../middleware/auth.js";

const router = express.Router();

router.use(verifyJWT);

router.post("/", classCategoryController.create);
router.get("/", classCategoryController.getAll);
router.get("/:id", classCategoryController.getById);
router.patch("/:id", classCategoryController.update);
router.delete("/:id", classCategoryController.delete);

export default router;
