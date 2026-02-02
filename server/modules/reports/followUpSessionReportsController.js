import { pool } from "../../server.js";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

const FollowUpSessionsModel = {
  // ===============================
  // REPORTS
  // ===============================
  async exportPDF(req, res) {
    const { organization_id } = req.query;
    const result = await pool.query(
      `SELECT * FROM follow_up_sessions WHERE organization_id=$1 ORDER BY follow_up_date DESC`,
      [organization_id]
    );

    const doc = new PDFDocument({ margin: 40, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=followup_sessions_report.pdf`);
    doc.pipe(res);

    doc.fontSize(18).text("Follow-Up Sessions Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).text("ID | Session ID | Counsellor ID | Follow-up Date | Status | Notes");
    doc.moveDown(0.5);

    result.rows.forEach(row => {
      doc.text(
        `${row.follow_up_id} | ${row.session_id} | ${row.counsellor_id} | ${row.follow_up_date?.toISOString().split('T')[0]} | ${row.status} | ${row.notes || ""}`
      );
    });

    doc.end();
  },

  async exportExcel(req, res) {
    const { organization_id } = req.query;
    const result = await pool.query(
      `SELECT * FROM follow_up_sessions WHERE organization_id=$1 ORDER BY follow_up_date DESC`,
      [organization_id]
    );

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Follow-Up Sessions");

    sheet.columns = [
      { header: "ID", key: "follow_up_id", width: 10 },
      { header: "Session ID", key: "session_id", width: 15 },
      { header: "Counsellor ID", key: "counsellor_id", width: 15 },
      { header: "Follow-up Date", key: "follow_up_date", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Notes", key: "notes", width: 40 },
    ];

    result.rows.forEach(row => {
      sheet.addRow({
        follow_up_id: row.follow_up_id,
        session_id: row.session_id,
        counsellor_id: row.counsellor_id,
        follow_up_date: row.follow_up_date?.toISOString().split('T')[0],
        status: row.status,
        notes: row.notes
      });
    });

    res.setHeader("Content-Disposition", `attachment; filename=followup_sessions_report.xlsx`);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    await workbook.xlsx.write(res);
    res.end();
  },

  async exportCSV(req, res) {
    const { organization_id } = req.query;
    const result = await pool.query(
      `SELECT * FROM follow_up_sessions WHERE organization_id=$1 ORDER BY follow_up_date DESC`,
      [organization_id]
    );

    let csv = "ID,Session ID,Counsellor ID,Follow-up Date,Status,Notes\n";
    result.rows.forEach(row => {
      csv += `"${row.follow_up_id}","${row.session_id}","${row.counsellor_id}","${row.follow_up_date?.toISOString().split('T')[0]}","${row.status}","${row.notes || ""}"\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=followup_sessions_report.csv`);
    res.send(csv);
  }
};

export default FollowUpSessionsModel;
