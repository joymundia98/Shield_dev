import express from "express";
import {
  exportPayrollPDF,
  exportPayrollExcel
} from "./payrollReportsController.js";

const router = express.Router();

router.get("/payroll/pdf", exportPayrollPDF);
router.get("/payroll/excel", exportPayrollExcel);

export default router;
