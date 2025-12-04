import express from "express";
import MemberStatisticsController from "./memberStatisticsController.js";

const router = express.Router();

// Get all statistics
router.get("/", MemberStatisticsController.getAll);

// Get statistics by date (format: YYYY-MM-DD)
router.get("/:date", MemberStatisticsController.getByDate);

// Upsert statistics
router.post("/", MemberStatisticsController.upsert);

// Recalculate today's statistics from members table
router.post("/recalculate-today", MemberStatisticsController.recalculateToday);

export default router;
