import { pool } from "../../server.js";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

const Budget = {

  // ===============================
  // EXPORT REPORTS
  // ===============================
  async exportPDF(req, res) {
    const organization_id = req.auth?.organization_id;

    const result = await pool.query(`
      SELECT 
        b.id,
        b.title,
        b.amount,
        b.year,
        b.month,
        c.name AS category_name,
        s.name AS subcategory_name
      FROM budgets b
      LEFT JOIN expense_categories c ON b.category_id = c.id
      LEFT JOIN expense_subcategories s ON b.expense_subcategory_id = s.id
      WHERE b.organization_id = $1
      ORDER BY b.year, b.month ASC
    `, [organization_id]);

    const doc = new PDFDocument({ margin: 40, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=budgets_report.pdf");
    doc.pipe(res);

    doc.fontSize(18).text("Budgets Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).text("ID | Title | Amount | Year | Month | Category | Subcategory");
    doc.moveDown(0.5);

    result.rows.forEach(row => {
      doc.text(
        `${row.id} | ${row.title} | ${row.amount} | ${row.year} | ${row.month} | ${row.category_name || "N/A"} | ${row.subcategory_name || "N/A"}`
      );
    });

    doc.end();
  },

  async exportExcel(req, res) {
    const organization_id = req.auth?.organization_id;

    const result = await pool.query(`
      SELECT 
        b.id,
        b.title,
        b.amount,
        b.year,
        b.month,
        c.name AS category_name,
        s.name AS subcategory_name
      FROM budgets b
      LEFT JOIN expense_categories c ON b.category_id = c.id
      LEFT JOIN expense_subcategories s ON b.expense_subcategory_id = s.id
      WHERE b.organization_id = $1
      ORDER BY b.year, b.month ASC
    `, [organization_id]);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Budgets");

    sheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Title", key: "title", width: 30 },
      { header: "Amount", key: "amount", width: 15 },
      { header: "Year", key: "year", width: 10 },
      { header: "Month", key: "month", width: 10 },
      { header: "Category", key: "category_name", width: 25 },
      { header: "Subcategory", key: "subcategory_name", width: 25 }
    ];

    result.rows.forEach(row => {
      sheet.addRow({
        id: row.id,
        title: row.title,
        amount: row.amount,
        year: row.year,
        month: row.month,
        category_name: row.category_name || "N/A",
        subcategory_name: row.subcategory_name || "N/A"
      });
    });

    res.setHeader("Content-Disposition", "attachment; filename=budgets_report.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    await workbook.xlsx.write(res);
    res.end();
  },

  async exportCSV(req, res) {
    const organization_id = req.auth?.organization_id;

    const result = await pool.query(`
      SELECT 
        b.id,
        b.title,
        b.amount,
        b.year,
        b.month,
        c.name AS category_name,
        s.name AS subcategory_name
      FROM budgets b
      LEFT JOIN expense_categories c ON b.category_id = c.id
      LEFT JOIN expense_subcategories s ON b.expense_subcategory_id = s.id
      WHERE b.organization_id = $1
      ORDER BY b.year, b.month ASC
    `, [organization_id]);

    let csv = "ID,Title,Amount,Year,Month,Category,Subcategory\n";
    result.rows.forEach(row => {
      csv += `"${row.id}","${row.title}","${row.amount}","${row.year}","${row.month}","${row.category_name || "N/A"}","${row.subcategory_name || "N/A"}"\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=budgets_report.csv");
    res.send(csv);
  }
};

export default Budget;
