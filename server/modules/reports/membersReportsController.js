import { pool } from "../../server.js";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

const Member = {
  // ===============================
  // REPORTS
  // ===============================
  async exportPDF(req, res) {
    const { organization_id, gender, status } = req.query;

    let query = `SELECT * FROM members WHERE organization_id = $1`;
    const values = [organization_id];

    if (gender) { query += ` AND gender = $${values.length + 1}`; values.push(gender); }
    if (status) { query += ` AND status = $${values.length + 1}`; values.push(status); }
    query += ` ORDER BY full_name`;

    const result = await pool.query(query, values);

    const doc = new PDFDocument({ margin: 40, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=members_report.pdf`);
    doc.pipe(res);

    doc.fontSize(18).text("Members Report", { align: "center" });
    doc.moveDown();
    if (gender) doc.fontSize(12).text(`Gender: ${gender}`);
    if (status) doc.fontSize(12).text(`Status: ${status}`);
    doc.moveDown();

    doc.fontSize(10).text("ID | Full Name | Email | Phone | Gender | Age | Status | Date Joined");
    doc.moveDown(0.5);

    result.rows.forEach(row => {
      doc.text(
        `${row.member_id} | ${row.full_name} | ${row.email} | ${row.phone} | ${row.gender} | ${row.age} | ${row.status} | ${row.date_joined?.toISOString().split('T')[0]}`
      );
    });

    doc.end();
  },

  async exportExcel(req, res) {
    const { organization_id, gender, status } = req.query;

    let query = `SELECT * FROM members WHERE organization_id = $1`;
    const values = [organization_id];
    if (gender) { query += ` AND gender = $${values.length + 1}`; values.push(gender); }
    if (status) { query += ` AND status = $${values.length + 1}`; values.push(status); }
    query += ` ORDER BY full_name`;

    const result = await pool.query(query, values);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Members");

    sheet.columns = [
      { header: "ID", key: "member_id", width: 10 },
      { header: "Full Name", key: "full_name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "phone", width: 18 },
      { header: "Gender", key: "gender", width: 12 },
      { header: "Age", key: "age", width: 10 },
      { header: "Status", key: "status", width: 12 },
      { header: "Date Joined", key: "date_joined", width: 15 }
    ];

    result.rows.forEach(row => {
      sheet.addRow({
        member_id: Number(row.member_id),
        full_name: row.full_name,
        email: row.email,
        phone: row.phone,
        gender: row.gender,
        age: Number(row.age),
        status: row.status,
        date_joined: row.date_joined ? row.date_joined.toISOString().split('T')[0] : ""
      });
    });

    res.setHeader("Content-Disposition", `attachment; filename=members_report.xlsx`);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    await workbook.xlsx.write(res);
    res.end();
  },

  async exportCSV(req, res) {
    const { organization_id, gender, status } = req.query;

    let query = `SELECT * FROM members WHERE organization_id = $1`;
    const values = [organization_id];
    if (gender) { query += ` AND gender = $${values.length + 1}`; values.push(gender); }
    if (status) { query += ` AND status = $${values.length + 1}`; values.push(status); }
    query += ` ORDER BY full_name`;

    const result = await pool.query(query, values);

    let csv = "ID,Full Name,Email,Phone,Gender,Age,Status,Date Joined\n";
    result.rows.forEach(row => {
      csv += `"${row.member_id}","${row.full_name}","${row.email}","${row.phone}","${row.gender}","${row.age}","${row.status}","${row.date_joined?.toISOString().split('T')[0]}"\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=members_report.csv`);
    res.send(csv);
  }
};

export default Member;
