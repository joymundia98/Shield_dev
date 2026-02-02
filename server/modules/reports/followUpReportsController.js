import { pool } from "../../server.js";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

const FollowUpsModel = {
  // ===============================
  // REPORTS
  // ===============================
  async exportPDF(req, res) {
    const { organization_id } = req.query;
    const result = await pool.query(
      `SELECT * FROM follow_ups WHERE organization_id=$1 ORDER BY followup_date DESC`,
      [organization_id]
    );

    const doc = new PDFDocument({ margin: 40, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=followups_report.pdf`);
    doc.pipe(res);

    doc.fontSize(18).text("Follow-Ups Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).text("ID | Visitor ID | Follow-up Date | Type | Notes");
    doc.moveDown(0.5);

    result.rows.forEach(row => {
      doc.text(`${row.followup_id} | ${row.visitor_id} | ${row.followup_date?.toISOString().split('T')[0]} | ${row.type} | ${row.notes || ""}`);
    });

    doc.end();
  },

  async exportExcel(req, res) {
    const { organization_id } = req.query;
    const result = await pool.query(
      `SELECT * FROM follow_ups WHERE organization_id=$1 ORDER BY followup_date DESC`,
      [organization_id]
    );

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Follow-Ups");

    sheet.columns = [
      { header: "ID", key: "followup_id", width: 10 },
      { header: "Visitor ID", key: "visitor_id", width: 15 },
      { header: "Follow-up Date", key: "followup_date", width: 15 },
      { header: "Type", key: "type", width: 20 },
      { header: "Notes", key: "notes", width: 40 }
    ];

    result.rows.forEach(row => {
      sheet.addRow({
        followup_id: row.followup_id,
        visitor_id: row.visitor_id,
        followup_date: row.followup_date?.toISOString().split('T')[0],
        type: row.type,
        notes: row.notes
      });
    });

    res.setHeader("Content-Disposition", `attachment; filename=followups_report.xlsx`);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    await workbook.xlsx.write(res);
    res.end();
  },

  async exportCSV(req, res) {
    const { organization_id } = req.query;
    const result = await pool.query(
      `SELECT * FROM follow_ups WHERE organization_id=$1 ORDER BY followup_date DESC`,
      [organization_id]
    );

    let csv = "ID,Visitor ID,Follow-up Date,Type,Notes\n";
    result.rows.forEach(row => {
      csv += `"${row.followup_id}","${row.visitor_id}","${row.followup_date?.toISOString().split('T')[0]}","${row.type}","${row.notes || ""}"\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=followups_report.csv`);
    res.send(csv);
  }
};

export default FollowUpsModel;
