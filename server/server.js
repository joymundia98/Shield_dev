import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from 'pg';

import userRoutes from './modules/user/userRoutes.js';
import authRoutes from './modules/auth/authRoutes.js';
import denominationRoutes from './modules/denomination/denominationRoutes.js';
import organizationRoutes from './modules/organization/OrgRoutes.js';

import { verifyJWT } from './middleware/auth.js';

dotenv.config();
const { Pool } = pkg;

const app = express();
const PORT = process.env.PORT || 3000;

// DB
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
export { pool };

// Middleware
app.use(cors());
app.use(express.json());

// ========================================
// 🔥 API ROUTES PREFIX
// ========================================
app.use("/api/auth", authRoutes);
app.use("/api/users", verifyJWT, userRoutes);
app.use("/api/denominations", verifyJWT, denominationRoutes);
app.use("/api/organizations", verifyJWT, organizationRoutes);

// Health Check
app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
