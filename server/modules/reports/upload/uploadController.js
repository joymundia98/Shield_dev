import fs from "fs";
import csv from "csv-parser";
import xlsx from "xlsx";
import bcrypt from "bcrypt";
import {
  USER_COLUMNS,
  MEMBER_COLUMNS,
  PROGRAM_COLUMNS,
  DEPARTMENT_COLUMNS,
  FOLLOWUP_COLUMNS,
  FOLLOWUP_SESSION_COLUMNS,
  INCOME_COLUMNS,
  EXPENSE_COLUMNS,
  BUDGET_COLUMNS,
  CONVERTS_COLUMNS,
  ATTENDANCE_COLUMNS,
  CONGREGANT_COLUMNS,
  SESSION_COLUMNS,
  SERVICE_COLUMNS,
  VISITOR_COLUMNS
} from "../../../utils/columnMap.js";
import { insertRows } from "../../../utils/insertRows.js";
import { normalizeRow } from "../../../utils/normalizeRow.js";

// Map upload type to table config
const getConfigByType = (type) => {
  switch (type) {
    case "users":
      return { COLUMN_MAP: USER_COLUMNS, tableName: "users", conflictColumn: "email" };
    case "members":
      return { COLUMN_MAP: MEMBER_COLUMNS, tableName: "members", conflictColumn: "member_id" };
    case "programs":
      return { COLUMN_MAP: PROGRAM_COLUMNS, tableName: "programs", conflictColumn: null };
    case "departments":
      return { COLUMN_MAP: DEPARTMENT_COLUMNS, tableName: "departments", conflictColumn: "department_id" };
    case "follow_ups":
      return { COLUMN_MAP: FOLLOWUP_COLUMNS, tableName: "follow_ups", conflictColumn: "followup_id" };
    case "follow_up_sessions":
      return { COLUMN_MAP: FOLLOWUP_SESSION_COLUMNS, tableName: "follow_up_sessions", conflictColumn: "follow_up_id" };
    case "incomes":
      return { COLUMN_MAP: INCOME_COLUMNS, tableName: "incomes", conflictColumn: "id" };
    case "expenses":
      return { COLUMN_MAP: EXPENSE_COLUMNS, tableName: "expenses", conflictColumn: "id" };
    case "budgets":
      return { COLUMN_MAP: BUDGET_COLUMNS, tableName: "budgets", conflictColumn: "id" };
    case "converts":
      return { COLUMN_MAP: CONVERTS_COLUMNS, tableName: "converts", conflictColumn: "id" };
    case "attendance":
      return { COLUMN_MAP: ATTENDANCE_COLUMNS, tableName: "attendance_records", conflictColumn: "record_id" };
    case "congregants":
      return { COLUMN_MAP: CONGREGANT_COLUMNS, tableName: "congregants", conflictColumn: "id" };
    case "sessions":
      return { COLUMN_MAP: SESSION_COLUMNS, tableName: "sessions", conflictColumn: "id" };
    case "services":
      return { COLUMN_MAP: SERVICE_COLUMNS, tableName: "services", conflictColumn: "id" };
    case "visitors":
      return { COLUMN_MAP: VISITOR_COLUMNS, tableName: "visitors", conflictColumn: "id" };
    default:
      throw new Error("Invalid upload type");
  }
};

export const uploadFile = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  if (!req.body.type) return res.status(400).json({ error: "No upload type specified" });

  const { type } = req.body;
  const filePath = req.file.path;
  const ext = req.file.originalname.split(".").pop().toLowerCase();

  try {
    const { COLUMN_MAP, tableName, conflictColumn } = getConfigByType(type);

    // 🏢 Extract organization_id from authenticated user
    const organization_id = req.user.organization_id;

    let rawRows = [];

    // 📄 Parse CSV
    if (ext === "csv") {
      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on("data", (row) => rawRows.push(row))
          .on("end", resolve)
          .on("error", reject);
      });
    }
    // 📊 Parse Excel
    else if (ext === "xlsx" || ext === "xls") {
      const workbook = xlsx.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      rawRows = xlsx.utils.sheet_to_json(sheet);
    } else {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: "Unsupported file type" });
    }

    const processedRows = [];

    for (const row of rawRows) {
      const normalized = normalizeRow(row, COLUMN_MAP);

      // 🔐 Hash password if users table
      if (type === "users" && normalized.password) {
        normalized.password = await bcrypt.hash(normalized.password, 10);
      }

      // 🏢 Auto-assign organization_id if table supports it
      if ("organization_id" in normalized || tableName !== "users") {
        normalized.organization_id = organization_id;
      }

      processedRows.push(normalized);
    }

    await insertRows(tableName, processedRows, COLUMN_MAP, conflictColumn);

    fs.unlinkSync(filePath);

    res.json({
      message: `${type} uploaded successfully`,
      count: processedRows.length
    });
  } catch (error) {
    console.error("Upload error:", error);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.status(500).json({ error: error.message || "Upload failed" });
  }
};
