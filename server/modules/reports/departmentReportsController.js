import { pool } from "../../server.js";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

const Department = {
  // ===============================
  // REPORTS
  // ===============================
  async exportPDF(req, res) {
    const { organization_id } = req.query;
    const result = await pool.query(
      `SELECT department_id AS id, name, description, category 
       FROM departments 
       WHERE organization_id=$1
       ORDER BY department_id ASC`,
      [organization_id]
    );

    const doc = new PDFDocument({ margin: 40, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=departments_report.pdf`);
    doc.pipe(res);

    doc.fontSize(18).text("Departments Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).text("ID | Name | Description | Category");
    doc.moveDown(0.5);

    result.rows.forEach(row => {
      doc.text(`${row.id} | ${row.name} | ${row.description || ""} | ${row.category}`);
    });

    doc.end();
  },

  async exportExcel(req, res) {
    const { organization_id } = req.query;
    const result = await pool.query(
      `SELECT department_id AS id, name, description, category 
       FROM departments 
       WHERE organization_id=$1
       ORDER BY department_id ASC`,
      [organization_id]
    );

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Departments");

    sheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Name", key: "name", width: 25 },
      { header: "Description", key: "description", width: 40 },
      { header: "Category", key: "category", width: 20 },
    ];

    result.rows.forEach(row => {
      sheet.addRow({
        id: Number(row.id),
        name: row.name,
        description: row.description,
        category: row.category
      });
    });

    res.setHeader("Content-Disposition", `attachment; filename=departments_report.xlsx`);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    await workbook.xlsx.write(res);
    res.end();
  },

  async exportCSV(req, res) {
    const { organization_id } = req.query;
    const result = await pool.query(
      `SELECT department_id AS id, name, description, category 
       FROM departments 
       WHERE organization_id=$1
       ORDER BY department_id ASC`,
      [organization_id]
    );

    let csv = "ID,Name,Description,Category\n";
    result.rows.forEach(row => {
      csv += `"${row.id}","${row.name}","${row.description || ""}","${row.category}"\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=departments_report.csv`);
    res.send(csv);
  }
};

export default Department;
