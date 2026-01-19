import express from "express";
import AssetDepreciationController from "./assetDepreciationController.js";

const router = express.Router();

router.get("/", AssetDepreciationController.getAll);
router.get("/:id", AssetDepreciationController.getById);
router.post("/", AssetDepreciationController.create);
router.patch("/:id", AssetDepreciationController.update);
router.delete("/:id", AssetDepreciationController.delete);

export default router;
