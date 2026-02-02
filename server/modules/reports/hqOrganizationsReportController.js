import { pool } from "../../server.js";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";


const HqOrganization = {
  // ===============================
  // REPORTS
  // ===============================
  async exportHqOrgPDF(req, res) {
    const { headquarters_id, status } = req.query;

    let query = `SELECT * FROM organizations WHERE 1=1`;
    const values = [];
    if (headquarters_id) { query += ` AND headquarters_id = $${values.length + 1}`; values.push(headquarters_id); }
    if (status) { query += ` AND status = $${values.length + 1}`; values.push(status); }
    query += ` ORDER BY name`;

    const result = await pool.query(query, values);

    const doc = new PDFDocument({ margin: 40, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=organizations_report.pdf`);
    doc.pipe(res);

    doc.fontSize(18).text("Organizations Report", { align: "center" });
    doc.moveDown();
    if (headquarters_id) doc.fontSize(12).text(`Headquarters ID: ${headquarters_id}`);
    if (status) doc.fontSize(12).text(`Status: ${status}`);
    doc.moveDown();

    doc.fontSize(10).text("ID | Name | Email | Account ID | Status | HQ ID | Type");
    doc.moveDown(0.5);

    result.rows.forEach(row => {
      doc.text(`${row.id} | ${row.name} | ${row.organization_email} | ${row.organization_account_id} | ${row.status} | ${row.headquarters_id} | ${row.org_type_id}`);
    });

    doc.end();
  },

  async exportHqOrgExcel(req, res) {
    const { headquarters_id, status } = req.query;

    let query = `SELECT * FROM organizations WHERE 1=1`;
    const values = [];
    if (headquarters_id) { query += ` AND headquarters_id = $${values.length + 1}`; values.push(headquarters_id); }
    if (status) { query += ` AND status = $${values.length + 1}`; values.push(status); }
    query += ` ORDER BY name`;

    const result = await pool.query(query, values);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Organizations");

    sheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Name", key: "name", width: 25 },
      { header: "Email", key: "organization_email", width: 30 },
      { header: "Account ID", key: "organization_account_id", width: 20 },
      { header: "Status", key: "status", width: 15 },
      { header: "Headquarters ID", key: "headquarters_id", width: 15 },
      { header: "Type ID", key: "org_type_id", width: 15 },
    ];

    result.rows.forEach(row => {
      sheet.addRow({
        id: Number(row.id),
        name: row.name,
        organization_email: row.organization_email,
        organization_account_id: row.organization_account_id,
        status: row.status,
        headquarters_id: Number(row.headquarters_id),
        org_type_id: Number(row.org_type_id)
      });
    });

    res.setHeader("Content-Disposition", `attachment; filename=organizations_report.xlsx`);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    await workbook.xlsx.write(res);
    res.end();
  },

  async exportHqOrgCSV(req, res) {
    const { headquarters_id, status } = req.query;

    let query = `SELECT * FROM organizations WHERE 1=1`;
    const values = [];
    if (headquarters_id) { query += ` AND headquarters_id = $${values.length + 1}`; values.push(headquarters_id); }
    if (status) { query += ` AND status = $${values.length + 1}`; values.push(status); }
    query += ` ORDER BY name`;

    const result = await pool.query(query, values);

    let csv = "ID,Name,Email,Account ID,Status,HQ ID,Type ID\n";
    result.rows.forEach(row => {
      csv += `"${row.id}","${row.name}","${row.organization_email}","${row.organization_account_id}","${row.status}","${row.headquarters_id}","${row.org_type_id}"\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=organizations_report.csv`);
    res.send(csv);
  }
};

export default HqOrganization;
