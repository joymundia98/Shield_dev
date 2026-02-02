import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure the uploads directory exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const allowedMimes = [
  "text/csv", // standard CSV
  "application/csv",
  "application/vnd.ms-excel", // older Excel CSVs
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
  "application/octet-stream" // sometimes Excel sends this
];

const fileFilter = (req, file, cb) => {
  console.log("Incoming file MIME type:", file.mimetype); // debug
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only CSV or Excel files allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter
});

export default upload;
