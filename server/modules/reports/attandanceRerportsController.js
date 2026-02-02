import { pool } from "../../server.js";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

const Attendance = {
  // ===============================
  // EXPORT REPORTS
  // ===============================
  async exportPDF(req, res) {
    const { organization_id } = req.query;
    const result = await pool.query(
      `SELECT * FROM attendance_records WHERE organization_id=$1 ORDER BY attendance_date DESC`,
      [organization_id]
    );

    const doc = new PDFDocument({ margin: 40, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=attendance_report.pdf`);
    doc.pipe(res);

    doc.fontSize(18).text("Attendance Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).text("Record ID | Status | Date | Service ID | Member ID | Visitor ID");
    doc.moveDown(0.5);

    result.rows.forEach(row => {
      doc.text(
        `${row.record_id} | ${row.status} | ${row.attendance_date.toISOString().split('T')[0]} | ${row.service_id} | ${row.member_id || ""} | ${row.visitor_id || ""}`
      );
    });

    doc.end();
  },

  async exportExcel(req, res) {
    const { organization_id } = req.query;
    const result = await pool.query(
      `SELECT * FROM attendance_records WHERE organization_id=$1 ORDER BY attendance_date DESC`,
      [organization_id]
    );

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Attendance");

    sheet.columns = [
      { header: "Record ID", key: "record_id", width: 12 },
      { header: "Status", key: "status", width: 15 },
      { header: "Date", key: "attendance_date", width: 15 },
      { header: "Service ID", key: "service_id", width: 12 },
      { header: "Member ID", key: "member_id", width: 12 },
      { header: "Visitor ID", key: "visitor_id", width: 12 }
    ];

    result.rows.forEach(row => sheet.addRow({
      record_id: row.record_id,
      status: row.status,
      attendance_date: row.attendance_date,
      service_id: row.service_id,
      member_id: row.member_id,
      visitor_id: row.visitor_id
    }));

    res.setHeader("Content-Disposition", `attachment; filename=attendance_report.xlsx`);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    await workbook.xlsx.write(res);
    res.end();
  },

  async exportCSV(req, res) {
    const { organization_id } = req.query;
    const result = await pool.query(
      `SELECT * FROM attendance_records WHERE organization_id=$1 ORDER BY attendance_date DESC`,
      [organization_id]
    );

    let csv = "Record ID,Status,Date,Service ID,Member ID,Visitor ID\n";
    result.rows.forEach(row => {
      csv += `"${row.record_id}","${row.status}","${row.attendance_date.toISOString().split('T')[0]}","${row.service_id}","${row.member_id || ""}","${row.visitor_id || ""}"\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=attendance_report.csv`);
    res.send(csv);
  }
};

export default Attendance;
