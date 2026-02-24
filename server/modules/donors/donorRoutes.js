// modules/finance/donors/donorsRoutes.js
import express from "express";
import DonorsController from "./donorController.js";
import { verifyJWT } from "../../middleware/auth.js";

const router = express.Router();

router.get("/", verifyJWT, DonorsController.getAll);
router.get("/:id", verifyJWT, DonorsController.getById);
router.post("/", verifyJWT, DonorsController.create);
router.patch("/:id", verifyJWT, DonorsController.update);
router.put("/:id", verifyJWT, DonorsController.update);
router.delete("/:id", verifyJWT, DonorsController.delete);

export default router;
