// modules/finance/donors/donorsRoutes.js
import express from "express";
import DonorsController from "./donorController.js";

const router = express.Router();

router.get("/", DonorsController.getAll);
router.get("/:id", DonorsController.getById);
router.post("/", DonorsController.create);
router.put("/:id", DonorsController.update);
router.delete("/:id", DonorsController.delete);

export default router;
