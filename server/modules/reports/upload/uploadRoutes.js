import express from "express";
import upload from "../../../utils/upload.js";
import { uploadFile } from "./uploadController.js";

const router = express.Router();

router.post("/", upload.single("file"), uploadFile);

export default router;
