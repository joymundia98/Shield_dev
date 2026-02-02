import { pool } from "../../server.js";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

const ConvertsModel = {

  // ===============================
  // EXPORT REPORTS
  // ===============================
  async exportPDF(req, res) {
    const { organization_id } = req.query;
    const result = await pool.query(
      `SELECT * FROM converts WHERE organization_id=$1 ORDER BY created_at DESC`,
      [organization_id]
    );

    const doc = new PDFDocument({ margin: 40, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=converts_report.pdf`);
    doc.pipe(res);

    doc.fontSize(18).text("Converts Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).text("ID | Type | Date | Member ID | Visitor ID | Follow-up Status");
    doc.moveDown(0.5);

    result.rows.forEach(row => {
      doc.text(`${row.id} | ${row.convert_type} | ${row.convert_date.toISOString().split('T')[0]} | ${row.member_id || ""} | ${row.visitor_id || ""} | ${row.follow_up_status || ""}`);
    });

    doc.end();
  },

  async exportExcel(req, res) {
    const { organization_id } = req.query;
    const result = await pool.query(
      `SELECT * FROM converts WHERE organization_id=$1 ORDER BY created_at DESC`,
      [organization_id]
    );

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Converts");

    sheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Type", key: "convert_type", width: 20 },
      { header: "Date", key: "convert_date", width: 15 },
      { header: "Member ID", key: "member_id", width: 15 },
      { header: "Visitor ID", key: "visitor_id", width: 15 },
      { header: "Follow-up Status", key: "follow_up_status", width: 20 }
    ];

    result.rows.forEach(row => sheet.addRow({
      id: row.id,
      convert_type: row.convert_type,
      convert_date: row.convert_date,
      member_id: row.member_id,
      visitor_id: row.visitor_id,
      follow_up_status: row.follow_up_status
    }));

    res.setHeader("Content-Disposition", `attachment; filename=converts_report.xlsx`);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    await workbook.xlsx.write(res);
    res.end();
  },

  async exportCSV(req, res) {
    const { organization_id } = req.query;
    const result = await pool.query(
      `SELECT * FROM converts WHERE organization_id=$1 ORDER BY created_at DESC`,
      [organization_id]
    );

    let csv = "ID,Type,Date,Member ID,Visitor ID,Follow-up Status\n";
    result.rows.forEach(row => {
      csv += `"${row.id}","${row.convert_type}","${row.convert_date.toISOString().split('T')[0]}","${row.member_id || ""}","${row.visitor_id || ""}","${row.follow_up_status || ""}"\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=converts_report.csv`);
    res.send(csv);
  }
};

export default ConvertsModel;
