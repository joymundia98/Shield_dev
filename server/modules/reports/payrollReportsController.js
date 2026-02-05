import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import { pool } from "../../server.js";

/**
 * EXPORT PAYROLL PDF
 */
export const exportPayrollPDF = async (req, res) => {
  const { year, month } = req.query;

  const organization_id = req.auth?.organization_id;

  const result = await pool.query(
    `SELECT * FROM payroll WHERE year=$1 AND month=$2 AND organization_id=$3 ORDER BY staff_id`,
    [year, month, organization_id]
  );

  const doc = new PDFDocument({ margin: 40, size: "A4" });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=payroll_${year}_${month}.pdf`
  );

  doc.pipe(res);

  // Title
  doc.fontSize(18).text("Payroll Report", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Year: ${year}   Month: ${month}`);
  doc.moveDown();

  // Table Header
  doc.fontSize(10).text(
    "Staff ID | Salary | Gross | Deductions | Net | Status"
  );
  doc.moveDown(0.5);

  // Rows
  result.rows.forEach((row) => {
    doc.text(
      `${row.staff_id} | ${row.salary} | ${row.total_gross} | ${row.total_deductions} | ${row.net_salary} | ${row.status}`
    );
  });

  doc.end();
};

/**
 * EXPORT PAYROLL EXCEL
 */
export const exportPayrollExcel = async (req, res) => {
  const { year, month } = req.query;

  const result = await pool.query(
    `SELECT * FROM payroll WHERE year=$1 AND month=$2 ORDER BY staff_id`,
    [year, month]
  );

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Payroll");

  sheet.columns = [
    { header: "Staff ID", key: "staff_id", width: 15 },
    { header: "Salary", key: "salary", width: 15 },
    { header: "Gross", key: "total_gross", width: 15 },
    { header: "Deductions", key: "total_deductions", width: 15 },
    { header: "Net Salary", key: "net_salary", width: 15 },
    { header: "Status", key: "status", width: 15 }
  ];

  result.rows.forEach((row) => {
    sheet.addRow(row);
  });

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=payroll_${year}_${month}.xlsx`
  );
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  await workbook.xlsx.write(res);
  res.end();
};
