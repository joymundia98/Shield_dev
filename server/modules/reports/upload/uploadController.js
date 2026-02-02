import fs from "fs";
import csv from "csv-parser";
import xlsx from "xlsx";
import { USER_COLUMNS, MEMBER_COLUMNS, PROGRAM_COLUMNS } from "../../../utils/columnMap.js";
import { insertRows } from "../../../utils/insertRows.js";

const getConfigByType = (type) => {
  switch (type) {
    case "users":
      return { COLUMN_MAP: USER_COLUMNS, tableName: "users", conflictColumn: "email" };
    case "members":
      return { COLUMN_MAP: MEMBER_COLUMNS, tableName: "members", conflictColumn: "membership_id" };
    case "programs":
      return { COLUMN_MAP: PROGRAM_COLUMNS, tableName: "programs", conflictColumn: null };
    default:
      throw new Error("Invalid upload type");
  }
};

export const uploadFile = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const { type } = req.body;

  try {
    const { COLUMN_MAP, tableName, conflictColumn } = getConfigByType(type);
    const filePath = req.file.path;
    const ext = req.file.originalname.split(".").pop().toLowerCase();
    let rows = [];

    if (ext === "csv") {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => rows.push(row))
        .on("end", async () => {
          await insertRows(tableName, rows, COLUMN_MAP, conflictColumn);
          fs.unlinkSync(filePath);
          res.json({ message: `${type} uploaded successfully`, count: rows.length });
        });
    } else if (ext === "xlsx") {
      const workbook = xlsx.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      rows = xlsx.utils.sheet_to_json(sheet);
      await insertRows(tableName, rows, COLUMN_MAP, conflictColumn);
      fs.unlinkSync(filePath);
      res.json({ message: `${type} uploaded successfully`, count: rows.length });
    } else {
      res.status(400).json({ error: "Unsupported file type" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Upload failed" });
  }
};
