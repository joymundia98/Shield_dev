import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import { pool } from "../../server.js";

/**
 * EXPORT PROGRAMS PDF
 */
export const exportProgramsPDF = async (req, res) => {
  const { organization_id, status, year, month } = req.query;

  let query = `
    SELECT 
      id,
      name,
      description,
      department_id,
      category_id,
      organization_id,
      date,
      time,
      venue,
      agenda,
      status,
      event_type,
      notes
    FROM programs
    WHERE organization_id = $1
  `;
  const values = [organization_id];

  if (status) {
    query += ` AND status = $${values.length + 1}`;
    values.push(status);
  }

  if (year) {
    query += ` AND EXTRACT(YEAR FROM date) = $${values.length + 1}`;
    values.push(year);
  }

  if (month) {
    query += ` AND EXTRACT(MONTH FROM date) = $${values.length + 1}`;
    values.push(month);
  }

  query += ` ORDER BY date ASC`;

  const result = await pool.query(query, values);

  const doc = new PDFDocument({ margin: 40, size: "A4" });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=programs_report.pdf`
  );

  doc.pipe(res);

  // Title
  doc.fontSize(18).text("Programs Report", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Organization ID: ${organization_id}`);
  if (status) doc.text(`Status: ${status}`);
  if (year) doc.text(`Year: ${year}`);
  if (month) doc.text(`Month: ${month}`);
  doc.moveDown();

  // Header
  doc.fontSize(10).text(
    "ID | Name | Dept | Category | Date | Time | Venue | Status | Type"
  );
  doc.moveDown(0.5);

  // Rows
  result.rows.forEach((row) => {
    doc.text(
      `${row.id} | ${row.name} | ${row.department_id} | ${row.category_id} | ${row.date} | ${row.time} | ${row.venue} | ${row.status} | ${row.event_type}`
    );
  });

  doc.end();
};

/**
 * EXPORT PROGRAMS EXCEL
 */
/**
 * EXPORT PROGRAMS CSV
 */
export const exportProgramsCSV = async (req, res) => {
  const { organization_id, status, year, month } = req.query;

  let query = `
    SELECT 
      id,
      name,
      description,
      department_id,
      category_id,
      organization_id,
      date,
      time,
      venue,
      agenda,
      status,
      event_type,
      notes
    FROM programs
    WHERE organization_id = $1
  `;
  const values = [organization_id];

  if (status) {
    query += ` AND status = $${values.length + 1}`;
    values.push(status);
  }

  if (year) {
    query += ` AND EXTRACT(YEAR FROM date) = $${values.length + 1}`;
    values.push(year);
  }

  if (month) {
    query += ` AND EXTRACT(MONTH FROM date) = $${values.length + 1}`;
    values.push(month);
  }

  query += ` ORDER BY date ASC`;

  const result = await pool.query(query, values);

  let csv = "ID,Name,Description,Department ID,Category ID,Organization ID,Date,Time,Venue,Agenda,Status,Event Type,Notes\n";

  result.rows.forEach((row) => {
    csv += `"${row.id}","${row.name}","${row.description}","${row.department_id}","${row.category_id}","${row.organization_id}","${row.date}","${row.time}","${row.venue}","${row.agenda}","${row.status}","${row.event_type}","${row.notes}"\n`;
  });

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=programs_report.csv`
  );

  res.send(csv);
};
