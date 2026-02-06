// uploadController.js
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
import { SendEmail } from "../../../utils/email.js";

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

    const organization_id = req.auth?.organization_id;
    if (!organization_id) throw new Error("Organization ID missing from token");

    let rawRows = [];

    if (ext === "csv") {
      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv({ mapHeaders: ({ header }) => header.trim() }))
          .on("data", (row) => rawRows.push(row))
          .on("end", resolve)
          .on("error", reject);
      });
    } else if (ext === "xlsx" || ext === "xls") {
      const workbook = xlsx.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      rawRows = xlsx.utils.sheet_to_json(sheet);
    } else {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: "Unsupported file type" });
    }

    const processedRows = [];
    const emailQueue = [];

    const generateRandomPassword = (length = 12) => {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
      let password = "";
      for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return password;
    };

    for (const row of rawRows) {
      const normalized = normalizeRow(row, COLUMN_MAP);

      if (type === "users") {
        const plainPassword = normalized.password || generateRandomPassword(12);
        normalized.password = await bcrypt.hash(plainPassword, 10);

        normalized.status = normalized.status || "pending";

        emailQueue.push({
          email: normalized.email,
          first_name: normalized.first_name,
          plainPassword
        });
      }

      normalized.organization_id = organization_id;
      processedRows.push(normalized);
    }

    console.log("🧪 FINAL ROWS TO INSERT:", processedRows);

    await insertRows(tableName, processedRows, COLUMN_MAP, conflictColumn);

    if (type === "users") {
      for (const user of emailQueue) {
        try {
          await SendEmail({
            to: user.email,
            subject: "Your Account Has Been Created",
            html: `
              <div style="font-family: Arial, sans-serif; max-width:600px;">
                <h1>Welcome ${user.first_name || "User"}!</h1>
                <p>Your account has been created successfully.</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Password:</strong> ${user.plainPassword}</p>
                <p>Please log in and change your password immediately.</p>
                <a href="https://sci-eld.org/login"
                   style="padding:10px 20px; background:#2563eb; color:#fff; text-decoration:none; border-radius:4px;">
                  Login
                </a>
              </div>
            `,
            text: `Welcome!

Your account has been created successfully.
Email: ${user.email}
Password: ${user.plainPassword}

Log in at https://sci-eld.org/login and change your password immediately.`
          });
        } catch (emailErr) {
          console.error(`Failed to send email to ${user.email}:`, emailErr);
        }
      }
    }

    fs.unlinkSync(filePath);

    res.json({
      message: `${type} uploaded successfully`,
      count: processedRows.length
    });
  } catch (error) {
    console.error("❌ Upload error:", error);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.status(500).json({ error: error.message || "Upload failed" });
  }
};
