import express from "express";
import payrollController from "./payrollController.js";
import { verifyJWT } from "../../middleware/auth.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/", payrollController.getAll);
router.get("/:id", payrollController.getById);
router.post("/", payrollController.create);
router.put("/:id", payrollController.update);
// router.patch("/:id", payrollController.update);
router.delete("/:id", payrollController.delete);

export default router;
