import { pool } from "../../server.js";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

const Visitor = {
  // Existing CRUD methods here...
  
  // ===============================
  // REPORT EXPORTS
  // ===============================
  async exportPDF(req, res) {
    const { organization_id } = req.query;
    const result = await pool.query(
      `SELECT id, name, gender, age, visit_date, phone, email, first_time 
       FROM visitors WHERE organization_id=$1 ORDER BY id ASC`,
      [organization_id]
    );

    const doc = new PDFDocument({ margin: 40, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=visitors_report.pdf");
    doc.pipe(res);

    doc.fontSize(18).text("Visitors Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).text("ID | Name | Gender | Age | Visit Date | Phone | Email | First Time");
    doc.moveDown(0.5);

    result.rows.forEach(row => {
      doc.text(
        `${row.id} | ${row.name} | ${row.gender} | ${row.age || ""} | ${row.visit_date.toISOString().split("T")[0]} | ${row.phone || ""} | ${row.email || ""} | ${row.first_time ? "Yes" : "No"}`
      );
    });

    doc.end();
  },

  async exportExcel(req, res) {
    const { organization_id } = req.query;
    const result = await pool.query(
      `SELECT id, name, gender, age, visit_date, phone, email, first_time 
       FROM visitors WHERE organization_id=$1 ORDER BY id ASC`,
      [organization_id]
    );

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Visitors");

    sheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Name", key: "name", width: 25 },
      { header: "Gender", key: "gender", width: 10 },
      { header: "Age", key: "age", width: 5 },
      { header: "Visit Date", key: "visit_date", width: 15 },
      { header: "Phone", key: "phone", width: 15 },
      { header: "Email", key: "email", width: 25 },
      { header: "First Time", key: "first_time", width: 10 },
    ];

    result.rows.forEach(row => sheet.addRow({
      id: row.id,
      name: row.name,
      gender: row.gender,
      age: row.age,
      visit_date: row.visit_date.toISOString().split("T")[0],
      phone: row.phone || "",
      email: row.email || "",
      first_time: row.first_time ? "Yes" : "No"
    }));

    res.setHeader("Content-Disposition", "attachment; filename=visitors_report.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    await workbook.xlsx.write(res);
    res.end();
  },

  async exportCSV(req, res) {
    const { organization_id } = req.query;
    const result = await pool.query(
      `SELECT id, name, gender, age, visit_date, phone, email, first_time 
       FROM visitors WHERE organization_id=$1 ORDER BY id ASC`,
      [organization_id]
    );

    let csv = "ID,Name,Gender,Age,Visit Date,Phone,Email,First Time\n";
    result.rows.forEach(row => {
      csv += `"${row.id}","${row.name}","${row.gender}","${row.age || ""}","${row.visit_date.toISOString().split("T")[0]}","${row.phone || ""}","${row.email || ""}","${row.first_time ? "Yes" : "No"}"\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=visitors_report.csv");
    res.send(csv);
  }
};

export default Visitor;
