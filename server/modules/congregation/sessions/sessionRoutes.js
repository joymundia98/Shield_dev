import express from "express";
import SessionsController from "./sessionController.js";
import { verifyJWT } from "../../../middleware/auth.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/", SessionsController.getAll);
router.get("/:id", SessionsController.getById);
router.post("/", SessionsController.create);
router.patch("/:id", SessionsController.update);
router.delete("/:id", SessionsController.delete);

export default router;
