import { pool } from "../../server.js";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

const Income = {
  // ===============================
  // REPORTS
  // ===============================
  async exportPDF(req, res) {
    const organization_id = req.auth?.organization_id;

    const result = await pool.query(
      `
      SELECT 
        i.id,
        i.date,
        i.giver,
        i.description,
        i.amount,
        i.status,
        s.name AS subcategory_name,
        u.first_name || ' ' || u.last_name AS user_name,
        d.name AS donor_name
      FROM incomes i
      LEFT JOIN income_subcategories s ON i.subcategory_id = s.id
      LEFT JOIN users u ON i.user_id = u.id
      LEFT JOIN donors d ON i.donor_id = d.id
      WHERE i.organization_id = $1
      ORDER BY i.date ASC;
      `,
      [organization_id]
    );

    const doc = new PDFDocument({ margin: 40, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=incomes_report.pdf");
    doc.pipe(res);

    doc.fontSize(18).text("Incomes Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).text("ID | Subcategory | User | Donor | Date | Giver | Description | Amount | Status");
    doc.moveDown(0.5);

    result.rows.forEach(row => {
      doc.text(
        `${row.id} | ${row.subcategory_name || "N/A"} | ${row.user_name || "N/A"} | ${row.donor_name || "N/A"} | ${row.date?.toISOString().split("T")[0]} | ${row.giver || ""} | ${row.description || ""} | ${row.amount} | ${row.status}`
      );
    });

    doc.end();
  },

  async exportExcel(req, res) {
    const organization_id = req.auth?.organization_id;

    const result = await pool.query(
      `
      SELECT 
        i.id,
        i.date,
        i.giver,
        i.description,
        i.amount,
        i.status,
        s.name AS subcategory_name,
        u.first_name || ' ' || u.last_name AS user_name,
        d.name AS donor_name
      FROM incomes i
      LEFT JOIN income_subcategories s ON i.subcategory_id = s.id
      LEFT JOIN users u ON i.user_id = u.id
      LEFT JOIN donors d ON i.donor_id = d.id
      WHERE i.organization_id = $1
      ORDER BY i.date ASC;
      `,
      [organization_id]
    );

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Incomes");

    sheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Subcategory", key: "subcategory_name", width: 20 },
      { header: "User", key: "user_name", width: 25 },
      { header: "Donor", key: "donor_name", width: 25 },
      { header: "Date", key: "date", width: 15 },
      { header: "Giver", key: "giver", width: 25 },
      { header: "Description", key: "description", width: 40 },
      { header: "Amount", key: "amount", width: 15 },
      { header: "Status", key: "status", width: 15 }
    ];

    result.rows.forEach(row => {
      sheet.addRow({
        id: row.id,
        subcategory_name: row.subcategory_name || "N/A",
        user_name: row.user_name || "N/A",
        donor_name: row.donor_name || "N/A",
        date: row.date ? row.date.toISOString().split("T")[0] : null,
        giver: row.giver,
        description: row.description,
        amount: row.amount,
        status: row.status
      });
    });

    res.setHeader("Content-Disposition", "attachment; filename=incomes_report.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    await workbook.xlsx.write(res);
    res.end();
  },

  async exportCSV(req, res) {
    const organization_id = req.auth?.organization_id;

    const result = await pool.query(
      `
      SELECT 
        i.id,
        i.date,
        i.giver,
        i.description,
        i.amount,
        i.status,
        s.name AS subcategory_name,
        u.first_name || ' ' || u.last_name AS user_name,
        d.name AS donor_name
      FROM incomes i
      LEFT JOIN income_subcategories s ON i.subcategory_id = s.id
      LEFT JOIN users u ON i.user_id = u.id
      LEFT JOIN donors d ON i.donor_id = d.id
      WHERE i.organization_id = $1
      ORDER BY i.date ASC;
      `,
      [organization_id]
    );

    let csv = "ID,Subcategory,User,Donor,Date,Giver,Description,Amount,Status\n";
    result.rows.forEach(row => {
      csv += `"${row.id}","${row.subcategory_name || "N/A"}","${row.user_name || "N/A"}","${row.donor_name || "N/A"}","${row.date?.toISOString().split("T")[0]}","${row.giver || ""}","${row.description || ""}","${row.amount}","${row.status}"\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=incomes_report.csv");
    res.send(csv);
  }
};

export default Income;
