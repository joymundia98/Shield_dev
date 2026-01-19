import express from "express";
import { teacherController } from "./teacherController.js";
import { verifyJWT } from "../../../middleware/auth.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/", teacherController.getAll);
router.get("/:id", teacherController.getById);
router.post("/", teacherController.create);
router.patch("/:id", teacherController.update);
router.delete("/:id", teacherController.delete);

export default router;
