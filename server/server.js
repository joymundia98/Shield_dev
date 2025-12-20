import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from 'pg';

import userRoutes from './modules/user/userRoutes.js';
import staffRoutes from './modules/hr/staff/staffRoutes.js';
import membersRoutes from './modules/member/memberRoutes.js';

import teacherRoutes from './modules/classes_/teachers/teacherRoutes.js';
import classRoutes from './modules/classes_/classRoutes.js';
import classCategoryRoutes from './modules/classes_/class_categories/classCategoryRoutes.js';
import classTeacherRoutes from './modules/classes_/class_teachers/classTeacherRoutes.js';
import studentRoutes from './modules/classes_/students/studentRoutes.js';

import convertRoutes  from './modules/converts/convertRoutes.js';
import counsellorRoutes from './modules/counsellors/counsellorRoutes.js';
import followUpRoutes from './modules/follow_ups/followUpRoutes.js';
import followUpSessionRoutes from './modules/follow_ups/follow_up_sessions/followUpSessionRoutes.js';

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
import payrollRoutes from './modules/payroll/payrollRoutes.js';
import memberStatsRoutes from './modules/congregation/member_statistics/memberStatisticsRoutes.js';
import congregantRoutes from './modules/congregation/congregants/congregantsRoutes.js';
import attendanceRoutes from './modules/congregation/attandance/attendanceRoutes.js';
import programRoutes from './modules/programs/programRoutes.js';
import attendeeRoutes from './modules/programs/attendees/attendeeRoutes.js';
import churchRoutes from './modules/profiles/churches/churchRoutes.js';
import coreValueRoutes from './modules/profiles/core_values/coreValueRoutes.js';
import leadershipRoutes from './modules/profiles/leadership/leadershipRoutes.js';
import ministryRoutes from './modules/profiles/ministries/ministryRoutes.js';
import sacramentRoutes from './modules/profiles/sacraments/sacramentRoutes.js';
import socialRoutes from './modules/profiles/social_links/socialRoutes.js';
import specialServiceRoutes from './modules/profiles/special_services/specialServiceRoutes.js';
import worshipRoutes from './modules/profiles/worship/worshipRoutes.js';
import visitorRoutes from './modules/congregation/visitors/visitorRoutes.js';
import donationRoutes from './modules/donation/donationRoutes.js';
import visitorServiceRoutes from './modules/congregation/visitors/visitorService/visitorServiceRoutes.js';
import visitorReferralRoutes from './modules/congregation/referral/visitorReferral/visitorRefferalRoutes.js';
import serviceRoutes from './modules/services/serviceRoutes.js';
import referralRoutes from './modules/congregation/referral/referralRoutes.js';
import purposeRoutes from './modules/congregation/purposes/purposeRoutes.js';
import sessionRoutes from './modules/congregation/sessions/sessionRoutes.js';
import assetRoutes from './modules/organization_assets/assets_/assetRoutes.js';
import assetCategoryRoutes from './modules/organization_assets/asset_categories/assetCategoryRoutes.js';
import assetRequestRoutes from './modules/organization_assets/asset_request/assetRequestRoutes.js';
import assetLocationRoutes from './modules/organization_assets/asset_location/assetLocationRoutes.js';
import assetDepreciationRoutes from './modules/organization_assets/asset_depreciation/assetDepreciationRoutes.js';
import assetWarrantyRoutes from './modules/organization_assets/asset_warranty/assetWarrantyRoutes.js';
import assetMaintenaceCategoryRoutes from './modules/organization_assets/maintenance_categories/maintenanceCategoryRoutes.js';
import assetMaintenaceRecordRoutes from './modules/organization_assets/maintenance_records/maintenanceRecordRoutes.js'; 
import rolesRoutes from './modules/role/roleRoutes.js';
import authRoutes from './modules/auth/authRoutes.js';
import permissionRoutes from './modules/permissions/permissionRoutes.js';
import rolePermissionRoutes from './modules/role_permission/rolePermRoutes.js';
import denominationRoutes from './modules/denomination/denominationRoutes.js';
import organizationRoutes from './modules/organization/OrgRoutes.js';
import orgTypeRoutes from './modules/organization_type/orgTypeRoutes.js';
import { verifyJWT } from './middleware/auth.js';

import reportRoutes from "./modules/reports/reportRoutes.js";

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

app.use("/api/roles", rolesRoutes);
app.use('/api/role_permissions', rolePermissionRoutes);
app.use('/api/permissions', permissionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", verifyJWT, userRoutes); // Protected route
app.use("/api/staff", staffRoutes);
app.use("/api/members", membersRoutes)
app.use("/api/departments", departmentRoutes);

// Donor types first
app.use("/api/donors/donor_types", donorTypeRoutes);

// Donor subcategories
app.use("/api/donors/donor_sub_category", donorSubCategoryRoutes);

// Then the generic donors route
app.use("/api/donors", donorRoutes);


app.use("/api/congregation/congregants", congregantRoutes);
app.use("/api/congregation/member_statistics", memberStatsRoutes);
app.use("/api/congregation/attendance", attendanceRoutes);

app.use("/api/classes", classRoutes);
app.use("/api/classes/class_categories", classCategoryRoutes);
app.use("/api/classes/class_teacher", classTeacherRoutes);
app.use("/api/classes/students", studentRoutes);
app.use("/api/classes/teachers", teacherRoutes);

app.use("/api/converts", convertRoutes);
app.use("/api/counsellors", counsellorRoutes);
app.use("/api/follow_ups", followUpRoutes);
app.use("/api/follow_up_sesions", followUpSessionRoutes);

app.use("/api/visitor", visitorRoutes);
app.use("/api/visitor-services", visitorServiceRoutes);
app.use("/api/visitor-referrals", visitorReferralRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/referrals", referralRoutes);
app.use("/api/congregation/purposes", purposeRoutes);
app.use("/api/congregation/sessions", sessionRoutes);
app.use('/api/programs/attendees', attendeeRoutes);
app.use('/api/programs', programRoutes);
app.use("/api/finance/budgets", budgetsRoutes);
app.use("/api/finance/attachments", attachmentRoutes);
app.use('/api/finance/expense_categories', financeExpenseCategoriesRoutes);
app.use('/api/finance/expense_subcategories', financeExpenseSubRoutes);
app.use('/api/finance/income_categories', financeIncomeCategoriesRoutes);
app.use('/api/finance/income_subcategories', financeIncomeSubRoutes);
app.use('/api/finance/expenses', expensesRoutes);
app.use('/api/finance/incomes', incomesRoutes);
app.use('/api/payroll', payrollRoutes);
app.use("/api/donations", donationRoutes);
app.use('/api/finance/extra_fields', extraFieldsRoutes);
app.use('/api/finance/budgets', budgetsRoutes);
app.use('/api/assets/categories', assetCategoryRoutes);
app.use('/api/assets/requests', assetRequestRoutes);
app.use('/api/assets/location', assetLocationRoutes)
app.use('/api/assets', assetRoutes);
app.use('/api/assets/maintenance_categories', assetMaintenaceCategoryRoutes);
app.use('/api/assets/maintenance_records', assetMaintenaceRecordRoutes);
app.use('/api/assets/depreciation', assetDepreciationRoutes);
app.use('/api/assets/warranty', assetWarrantyRoutes);
app.use('/api/profiles/churches', churchRoutes);
app.use('/api/profiles/core_values', coreValueRoutes);
app.use('/api/profiles/leadership', leadershipRoutes);
app.use('/api/profiles/ministries', ministryRoutes);
app.use('/api/profiles/sacraments', sacramentRoutes);
app.use('/api/profiles/social_links', socialRoutes);
app.use('/api/profiles/special_services', specialServiceRoutes);
app.use('/api/profiles/worship', worshipRoutes);

app.use("/api/reports", reportRoutes);

app.use("/api/leave_requests", leaveRoutes);
app.use("/api/denominations", verifyJWT, denominationRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/organization_type", orgTypeRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
