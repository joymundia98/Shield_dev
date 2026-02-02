import { pool } from "../../server.js";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

const Congregant = {
  // ===============================
  // REPORT EXPORTS
  // ===============================
  async exportPDF(req, res) {
    const { organization_id } = req.query;
    const result = await pool.query(
      `SELECT id, name, gender, category_id FROM congregants WHERE organization_id=$1 ORDER BY id ASC`,
      [organization_id]
    );

    const doc = new PDFDocument({ margin: 40, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=congregants_report.pdf`);
    doc.pipe(res);

    doc.fontSize(18).text("Congregants Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).text("ID | Name | Gender | Category ID");
    doc.moveDown(0.5);

    result.rows.forEach(row => {
      doc.text(`${row.id} | ${row.name} | ${row.gender} | ${row.category_id}`);
    });

    doc.end();
  },

  async exportExcel(req, res) {
    const { organization_id } = req.query;
    const result = await pool.query(
      `SELECT id, name, gender, category_id FROM congregants WHERE organization_id=$1 ORDER BY id ASC`,
      [organization_id]
    );

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Congregants");

    sheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Name", key: "name", width: 25 },
      { header: "Gender", key: "gender", width: 10 },
      { header: "Category ID", key: "category_id", width: 12 }
    ];

    result.rows.forEach(row => sheet.addRow(row));

    res.setHeader("Content-Disposition", `attachment; filename=congregants_report.xlsx`);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    await workbook.xlsx.write(res);
    res.end();
  },

  async exportCSV(req, res) {
    const { organization_id } = req.query;
    const result = await pool.query(
      `SELECT id, name, gender, category_id FROM congregants WHERE organization_id=$1 ORDER BY id ASC`,
      [organization_id]
    );

    let csv = "ID,Name,Gender,Category ID\n";
    result.rows.forEach(row => {
      csv += `"${row.id}","${row.name}","${row.gender}","${row.category_id}"\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=congregants_report.csv`);
    res.send(csv);
  }
};

export default Congregant;
