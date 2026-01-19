import express from "express";
import AttendanceController from "./attendanceController.js";
import { verifyJWT } from "../../../middleware/auth.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/", AttendanceController.getAll);
router.get("/:id", AttendanceController.getById);
router.post("/", AttendanceController.create);
router.patch("/:id", AttendanceController.update);
router.delete("/:id", AttendanceController.delete);

export default router;
