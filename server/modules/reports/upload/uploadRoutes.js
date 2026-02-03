import express from "express";
import upload from "../../../utils/upload.js";
import { uploadFile } from "./uploadController.js";
import { verifyJWT } from "../../../middleware/auth.js";

const router = express.Router();

router.post("/", verifyJWT, upload.single("file"), uploadFile);

export default router;
