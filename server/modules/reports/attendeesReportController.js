import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import { pool } from "../../server.js";

/**
 * EXPORT ATTENDEES PDF
 */
export const exportAttendeesPDF = async (req, res) => {
  const { program_id, gender, role } = req.query;

  const organization_id = req.auth?.organization_id;

  let query = `
    SELECT 
      attendee_id,
      name,
      email,
      phone,
      age,
      gender,
      program_id,
      role,
      organization_id
    FROM attendees
    WHERE organization_id = $1
  `;
  const values = [organization_id];

  if (program_id) {
    query += ` AND program_id = $${values.length + 1}`;
    values.push(program_id);
  }

  if (gender) {
    query += ` AND gender = $${values.length + 1}`;
    values.push(gender);
  }

  if (role) {
    query += ` AND role = $${values.length + 1}`;
    values.push(role);
  }

  query += ` ORDER BY name ASC`;

  const result = await pool.query(query, values);

  const doc = new PDFDocument({ margin: 40, size: "A4" });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=attendees_report.pdf`
  );

  doc.pipe(res);

  // Title
  doc.fontSize(18).text("Attendees Report", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Organization ID: ${organization_id}`);
  if (program_id) doc.text(`Program ID: ${program_id}`);
  if (gender) doc.text(`Gender: ${gender}`);
  if (role) doc.text(`Role: ${role}`);
  doc.moveDown();

  // Header
  doc.fontSize(10).text(
    "ID | Name | Email | Phone | Age | Gender | Program | Role"
  );
  doc.moveDown(0.5);

  // Rows
  result.rows.forEach((row) => {
    doc.text(
      `${row.attendee_id} | ${row.name} | ${row.email} | ${row.phone} | ${row.age} | ${row.gender} | ${row.program_id} | ${row.role}`
    );
  });

  doc.end();
};

/**
 * EXPORT ATTENDEES EXCEL
 */
export const exportAttendeesExcel = async (req, res) => {
  const { program_id, gender, role } = req.query;

  const organization_id = req.auth?.organization_id;

  let query = `
    SELECT 
      attendee_id,
      name,
      email,
      phone,
      age,
      gender,
      program_id,
      role,
      organization_id
    FROM attendees
    WHERE organization_id = $1
  `;
  const values = [organization_id];

  if (program_id) {
    query += ` AND program_id = $${values.length + 1}`;
    values.push(program_id);
  }

  if (gender) {
    query += ` AND gender = $${values.length + 1}`;
    values.push(gender);
  }

  if (role) {
    query += ` AND role = $${values.length + 1}`;
    values.push(role);
  }

  query += ` ORDER BY name ASC`;

  const result = await pool.query(query, values);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Attendees");

  sheet.columns = [
    { header: "Attendee ID", key: "attendee_id", width: 15 },
    { header: "Name", key: "name", width: 25 },
    { header: "Email", key: "email", width: 30 },
    { header: "Phone", key: "phone", width: 18 },
    { header: "Age", key: "age", width: 10 },
    { header: "Gender", key: "gender", width: 12 },
    { header: "Program ID", key: "program_id", width: 15 },
    { header: "Role", key: "role", width: 15 },
    { header: "Organization ID", key: "organization_id", width: 15 },
  ];

  result.rows.forEach((row) => {
    sheet.addRow({
      attendee_id: Number(row.attendee_id),
      name: row.name,
      email: row.email,
      phone: row.phone,
      age: Number(row.age),
      gender: row.gender,
      program_id: Number(row.program_id),
      role: row.role,
      organization_id: Number(row.organization_id),
    });
  });

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=attendees_report.xlsx`
  );
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  await workbook.xlsx.write(res);
  res.end();
};

/**
 * EXPORT ATTENDEES CSV
 */
export const exportAttendeesCSV = async (req, res) => {
  const { program_id, gender, role } = req.query;

  const organization_id = req.auth?.organization_id;

  let query = `
    SELECT 
      attendee_id,
      name,
      email,
      phone,
      age,
      gender,
      program_id,
      role,
      organization_id
    FROM attendees
    WHERE organization_id = $1
  `;
  const values = [organization_id];

  if (program_id) {
    query += ` AND program_id = $${values.length + 1}`;
    values.push(program_id);
  }

  if (gender) {
    query += ` AND gender = $${values.length + 1}`;
    values.push(gender);
  }

  if (role) {
    query += ` AND role = $${values.length + 1}`;
    values.push(role);
  }

  query += ` ORDER BY name ASC`;

  const result = await pool.query(query, values);

  let csv =
    "Attendee ID,Name,Email,Phone,Age,Gender,Program ID,Role,Organization ID\n";

  result.rows.forEach((row) => {
    csv += `"${row.attendee_id}","${row.name}","${row.email}","${row.phone}","${row.age}","${row.gender}","${row.program_id}","${row.role}","${row.organization_id}"\n`;
  });

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=attendees_report.csv`
  );

  res.send(csv);
};
