import { pool } from "../../server.js";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

const Session = {

  // ===============================
  // REPORT EXPORTS
  // ===============================
  async exportPDF(req, res) {
    const { organization_id } = req.query;
    const result = await pool.query(
      `SELECT id, name, date, description FROM sessions WHERE organization_id=$1 ORDER BY date DESC`,
      [organization_id]
    );

    const doc = new PDFDocument({ margin: 40, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=sessions_report.pdf");
    doc.pipe(res);

    doc.fontSize(18).text("Sessions Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).text("ID | Name | Date | Description");
    doc.moveDown(0.5);

    result.rows.forEach(row => {
      doc.text(`${row.id} | ${row.name} | ${row.date.toISOString().split("T")[0]} | ${row.description || ""}`);
    });

    doc.end();
  },

  async exportExcel(req, res) {
    const { organization_id } = req.query;
    const result = await pool.query(
      `SELECT id, name, date, description FROM sessions WHERE organization_id=$1 ORDER BY date DESC`,
      [organization_id]
    );

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Sessions");

    sheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Name", key: "name", width: 30 },
      { header: "Date", key: "date", width: 15 },
      { header: "Description", key: "description", width: 40 },
    ];

    result.rows.forEach(row => sheet.addRow({
      id: row.id,
      name: row.name,
      date: row.date.toISOString().split("T")[0],
      description: row.description || ""
    }));

    res.setHeader("Content-Disposition", "attachment; filename=sessions_report.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    await workbook.xlsx.write(res);
    res.end();
  },

  async exportCSV(req, res) {
    const { organization_id } = req.query;
    const result = await pool.query(
      `SELECT id, name, date, description FROM sessions WHERE organization_id=$1 ORDER BY date DESC`,
      [organization_id]
    );

    let csv = "ID,Name,Date,Description\n";
    result.rows.forEach(row => {
      csv += `"${row.id}","${row.name}","${row.date.toISOString().split("T")[0]}","${row.description || ""}"\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=sessions_report.csv");
    res.send(csv);
  }
};

export default Session;
