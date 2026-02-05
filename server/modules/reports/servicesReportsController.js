import { pool } from "../../server.js";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

const Service = {
  // ===============================
  // REPORT EXPORTS
  // ===============================
  async exportPDF(req, res) {
    const organization_id = req.auth?.organization_id;
    const result = await pool.query(
      `SELECT id, name, description, created_at FROM services WHERE organization_id=$1 ORDER BY id ASC`,
      [organization_id]
    );

    const doc = new PDFDocument({ margin: 40, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=services_report.pdf");
    doc.pipe(res);

    doc.fontSize(18).text("Services Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).text("ID | Name | Description | Created At");
    doc.moveDown(0.5);

    result.rows.forEach(row => {
      doc.text(`${row.id} | ${row.name} | ${row.description || ""} | ${row.created_at.toISOString().split("T")[0]}`);
    });

    doc.end();
  },

  async exportExcel(req, res) {
    const organization_id = req.auth?.organization_id;
    const result = await pool.query(
      `SELECT id, name, description, created_at FROM services WHERE organization_id=$1 ORDER BY id ASC`,
      [organization_id]
    );

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Services");

    sheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Name", key: "name", width: 30 },
      { header: "Description", key: "description", width: 40 },
      { header: "Created At", key: "created_at", width: 15 },
    ];

    result.rows.forEach(row => sheet.addRow({
      id: row.id,
      name: row.name,
      description: row.description || "",
      created_at: row.created_at.toISOString().split("T")[0]
    }));

    res.setHeader("Content-Disposition", "attachment; filename=services_report.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    await workbook.xlsx.write(res);
    res.end();
  },

  async exportCSV(req, res) {
    const organization_id = req.auth?.organization_id;
    const result = await pool.query(
      `SELECT id, name, description, created_at FROM services WHERE organization_id=$1 ORDER BY id ASC`,
      [organization_id]
    );

    let csv = "ID,Name,Description,Created At\n";
    result.rows.forEach(row => {
      csv += `"${row.id}","${row.name}","${row.description || ""}","${row.created_at.toISOString().split("T")[0]}"\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=services_report.csv");
    res.send(csv);
  }
};

export default Service;
