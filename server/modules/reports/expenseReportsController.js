import { pool } from "../../server.js";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

const Expense = {
  // ===============================
  // REPORTS
  // ===============================
  async exportPDF(req, res) {
    const { organization_id } = req.query;
    const result = await pool.query(`
      SELECT id, subcategory_id, user_id, department_id, date, description, amount, status
      FROM expenses
      WHERE organization_id = $1
      ORDER BY date ASC
    `, [organization_id]);

    const doc = new PDFDocument({ margin: 40, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=expenses_report.pdf`);
    doc.pipe(res);

    doc.fontSize(18).text("Expenses Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).text("ID | Subcategory | User | Department | Date | Description | Amount | Status");
    doc.moveDown(0.5);

    result.rows.forEach(row => {
      doc.text(`${row.id} | ${row.subcategory_id} | ${row.user_id} | ${row.department_id} | ${row.date?.toISOString().split('T')[0]} | ${row.description || ""} | ${row.amount} | ${row.status}`);
    });

    doc.end();
  },

  async exportExcel(req, res) {
    const { organization_id } = req.query;
    const result = await pool.query(`
      SELECT id, subcategory_id, user_id, department_id, date, description, amount, status
      FROM expenses
      WHERE organization_id = $1
      ORDER BY date ASC
    `, [organization_id]);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Expenses");

    sheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Subcategory", key: "subcategory_id", width: 15 },
      { header: "User ID", key: "user_id", width: 15 },
      { header: "Department ID", key: "department_id", width: 15 },
      { header: "Date", key: "date", width: 15 },
      { header: "Description", key: "description", width: 40 },
      { header: "Amount", key: "amount", width: 15 },
      { header: "Status", key: "status", width: 15 }
    ];

    result.rows.forEach(row => {
      sheet.addRow({
        id: row.id,
        subcategory_id: row.subcategory_id,
        user_id: row.user_id,
        department_id: row.department_id,
        date: row.date?.toISOString().split('T')[0],
        description: row.description,
        amount: row.amount,
        status: row.status
      });
    });

    res.setHeader("Content-Disposition", `attachment; filename=expenses_report.xlsx`);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    await workbook.xlsx.write(res);
    res.end();
  },

  async exportCSV(req, res) {
    const { organization_id } = req.query;
    const result = await pool.query(`
      SELECT id, subcategory_id, user_id, department_id, date, description, amount, status
      FROM expenses
      WHERE organization_id = $1
      ORDER BY date ASC
    `, [organization_id]);

    let csv = "ID,Subcategory ID,User ID,Department ID,Date,Description,Amount,Status\n";
    result.rows.forEach(row => {
      csv += `"${row.id}","${row.subcategory_id}","${row.user_id}","${row.department_id}","${row.date?.toISOString().split('T')[0]}","${row.description || ""}","${row.amount}","${row.status}"\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=expenses_report.csv`);
    res.send(csv);
  }
};

export default Expense;
