import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from 'pg';

import userRoutes from './modules/user/userRoutes.js';
import staffRoutes from './modules/hr/staff/staffRoutes.js';
import membersRoutes from './modules/member/memberRoutes.js';
import leaveRoutes from './modules/hr/leave/leaveRoutes.js';
import donorRoutes from './modules/donors/donorRoutes.js';
import donorTypeRoutes from './modules/donors/donor_types/donorTypeRoutes.js';
import donorSubCategoryRoutes from './modules/donors/donor_sub_category/donorSubCategoryRoutes.js';
import attachmentRoutes from './modules/finance/attachments/attachmentsRoutes.js';
import departmentRoutes from './modules/hr/departments/departmentRoutes.js';
import financeExpenseCategoriesRoutes from './modules/finance/expense_categories/expenseCategoryRoutes.js';
import financeExpenseSubRoutes from './modules/finance/expense_sub_categories/expenseSubRoutes.js';
import financeIncomeCategoriesRoutes from './modules/finance/income_categories/incomeCategoryRoutes.js';
import financeIncomeSubRoutes from './modules/finance/income_sub_categories/incomeSubRoutes.js';
import expensesRoutes from './modules/finance/expenses/expenseRoutes.js';
import incomesRoutes from './modules/finance/incomes/incomeRoutes.js';
import extraFieldsRoutes from './modules/finance/extra_fields/extraFieldRoutes.js';
import budgetsRoutes from './modules/finance/budgets/budgetRoutes.js';
import memberStatsRoutes from './modules/congregation/member_statistics/memberStatisticsRoutes.js';
import congregantRoutes from './modules/congregation/congregants/congregantsRoutes.js';
import attendanceRoutes from './modules/congregation/attandance/attendanceRoutes.js'
import visitorRoutes from './modules/congregation/visitors/visitorRoutes.js';
import visitorServiceRoutes from './modules/congregation/visitors/visitorService/visitorServiceRoutes.js';
import visitorReferralRoutes from './modules/congregation/referral/visitorReferral/visitorRefferalRoutes.js';
import serviceRoutes from './modules/services/serviceRoutes';
import referralRoutes from './modules/congregation/referral/referralRoutes.js';
import purposeRoutes from './modules/congregation/purposes/purposeRoutes.js'
import sessionRoutes from './modules/congregation/sessions/sessionRoutes.js'
import rolesRoutes from './modules/role/roleRoutes.js';
import authRoutes from './modules/auth/authRoutes.js';
import denominationRoutes from './modules/denomination/denominationRoutes.js';
import organizationRoutes from './modules/organization/OrgRoutes.js';
import { verifyJWT } from './middleware/auth.js';
// import { OrganizationController } from './modules/organization/organizationController.js';

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

// // Public route for dropdown
// app.get("/api/organizations/public", OrganizationController.listPublic);

// Protected routes
app.use("/api/roles", rolesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", verifyJWT, userRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/members", membersRoutes)
app.use("/api/departments", departmentRoutes);
app.use("/api/donors", donorRoutes)
app.use("/api/donors/donor_types", donorTypeRoutes);
app.use("/api/donors/donor_sub_category", donorSubCategoryRoutes);
app.use("/api/congregation/congregants/", congregantRoutes)
app.use("/api/congregation/member_statistics", memberStatsRoutes)
app.use("/api/congregation/attendance", attendanceRoutes)
// Visitor Routes
app.use("/api/visitor", visitorRoutes);
app.use("/api/visitor-services", visitorServiceRoutes);
app.use("/api/visitor-referrals", visitorReferralRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/referrals", referralRoutes);
app.use("/api/congregation/purposes", purposeRoutes)
app.use("/api/congregation/sessions", sessionRoutes);
app.use("/api/finance/budgets", budgetsRoutes);
app.use("/api/finance/attachments", attachmentRoutes);
app.use('/api/finance/expense_categories', financeExpenseCategoriesRoutes);
app.use('/api/finance/expense_subcategories', financeExpenseSubRoutes);
app.use('/api/finance/income_categories', financeIncomeCategoriesRoutes);
app.use('/api/finance/income_subcategories', financeIncomeSubRoutes);
app.use('/api/finance/expenses', expensesRoutes);
app.use('/api/finance/incomes', incomesRoutes);
app.use('/api/finance/extra_fields', extraFieldsRoutes);
app.use('/api/finance/budgets', budgetsRoutes);
app.use("/api/leave_requests", leaveRoutes);
app.use("/api/denominations", verifyJWT, denominationRoutes);
app.use("/api/organizations", verifyJWT, organizationRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
