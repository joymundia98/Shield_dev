import { pool } from "../../server.js";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

const Budget = {

  // ===============================
  // EXPORT REPORTS
  // ===============================
  async exportPDF(req, res) {
    const { organization_id } = req.query;
    const result = await pool.query(`
      SELECT id, title, amount, year, month, category_id, expense_subcategory_id
      FROM budgets
      WHERE organization_id=$1
      ORDER BY year, month ASC
    `, [organization_id]);

    const doc = new PDFDocument({ margin: 40, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=budgets_report.pdf`);
    doc.pipe(res);

    doc.fontSize(18).text("Budgets Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).text("ID | Title | Amount | Year | Month | Category | Subcategory");
    doc.moveDown(0.5);

    result.rows.forEach(row => {
      doc.text(`${row.id} | ${row.title} | ${row.amount} | ${row.year} | ${row.month} | ${row.category_id || ""} | ${row.expense_subcategory_id || ""}`);
    });

    doc.end();
  },

  async exportExcel(req, res) {
    const { organization_id } = req.query;
    const result = await pool.query(`
      SELECT id, title, amount, year, month, category_id, expense_subcategory_id
      FROM budgets
      WHERE organization_id=$1
      ORDER BY year, month ASC
    `, [organization_id]);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Budgets");

    sheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Title", key: "title", width: 30 },
      { header: "Amount", key: "amount", width: 15 },
      { header: "Year", key: "year", width: 10 },
      { header: "Month", key: "month", width: 10 },
      { header: "Category ID", key: "category_id", width: 15 },
      { header: "Subcategory ID", key: "expense_subcategory_id", width: 15 }
    ];

    result.rows.forEach(row => sheet.addRow(row));

    res.setHeader("Content-Disposition", `attachment; filename=budgets_report.xlsx`);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    await workbook.xlsx.write(res);
    res.end();
  },

  async exportCSV(req, res) {
    const { organization_id } = req.query;
    const result = await pool.query(`
      SELECT id, title, amount, year, month, category_id, expense_subcategory_id
      FROM budgets
      WHERE organization_id=$1
      ORDER BY year, month ASC
    `, [organization_id]);

    let csv = "ID,Title,Amount,Year,Month,Category ID,Subcategory ID\n";
    result.rows.forEach(row => {
      csv += `"${row.id}","${row.title}","${row.amount}","${row.year}","${row.month}","${row.category_id || ""}","${row.expense_subcategory_id || ""}"\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=budgets_report.csv`);
    res.send(csv);
  }
};

export default Budget;
