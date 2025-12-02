import { BrowserRouter, Routes, Route } from "react-router-dom";

import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { LandingPage } from "./pages/LandingPage";
import { OrgLoginPage } from "./pages/orgLoginPage";

import DashboardPage from "./pages/DashboardPage";

// Department Dashboards
import PastoralDashboard from "./pages/pastoral/dashboard";
import ProgramsDashboard from "./pages/programs/dashboard";
import MinistryDashboard from "./pages/ministry/dashboard";
import HRDashboard from "./pages/hr/dashboard";
import GovernanceDashboard from "./pages/governance/dashboard";
import FinanceDashboard from "./pages/finance/dashboard";
import DonorDashboard from "./pages/donor/dashboard";
import CongregationDashboard from "./pages/congregation/dashboard";

// NEW — Class Module Dashboard
import ClassDashboard from "./pages/class/dashboard";

// NEW — Asset Module Dashboard
import AssetDashboard from "./pages/assets/dashboard";

// HR Module Functional Pages
import StaffDirectory from "./pages/hr/staffDirectory";
import LeaveManagementPage from "./pages/hr/leave";
import DepartmentsPage from "./pages/hr/departments";
import AddStaffPage from "./pages/hr/addStaff";

// Asset Module Functional Pages
import AssetsPage from "./pages/assets/assets";
import DepreciationPage from "./pages/assets/depreciation";
import AddAssetPage from "./pages/assets/addAsset";
import MaintenancePage from "./pages/assets/maintenance";

// Finance Module Functional Pages
import PayrollPage from "./pages/finance/payroll";
import ExpenseDashboardPage from "./pages/finance/expenseDashboard";
import ExpenseTrackerPage from "./pages/finance/expensetracker";
import AddExpensePage from "./pages/finance/addExpense";
import IncomeTrackerPage from "./pages/finance/incometracker";
import AddIncomePage from "./pages/finance/addIncome";
import IncomeDashboardPage from "./pages/finance/incomeDashboard";
import FinanceCategoryPage from "./pages/finance/financeCategory";
import BudgetsPage from "./pages/finance/budgets";          
import SetBudgetsPage from "./pages/finance/setBudget"; 

// Donors Module Functional Pages
import DonorsPage from "./pages/donor/donors";
import AddDonorPage from "./pages/donor/addDonor";
import DonationsManagementPage from "./pages/donor/donations";
import AddDonationPage from "./pages/donor/addDonation";
import DonorCategoriesPage from "./pages/donor/donorCategories";

// Ministry Module Functional Pages
import PastorsPage from "./pages/ministry/pastors";

// Congregation Module Functional Pages
import AttendancePage from "./pages/congregation/attendance";
import RecordAttendance from "./pages/congregation/RecordAttendance";
import ChurchMembersDashboard from "./pages/congregation/members";
import MembersRecords from "./pages/congregation/memberRecords";
import AddMemberPage from "./pages/congregation/addMember";

// Categories Page
import CategoriesPage from "./pages/assets/categories";

import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* PUBLIC PAGES */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ORGANIZATION LOGIN */}
          <Route path="/org-login" element={<OrgLoginPage />} />
          <Route path="/org-dashboard" element={<DashboardPage />} />

          {/* MAIN DASHBOARD */}
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* ------------------------------
                DEPT ROOT DASHBOARDS
          --------------------------------*/}
          <Route path="/pastoral/dashboard" element={<PastoralDashboard />} />
          <Route path="/programs/dashboard" element={<ProgramsDashboard />} />
          <Route path="/ministry/dashboard" element={<MinistryDashboard />} />
          <Route path="/hr/dashboard" element={<HRDashboard />} />
          <Route path="/governance/dashboard" element={<GovernanceDashboard />} />
          <Route path="/finance/dashboard" element={<FinanceDashboard />} />
          <Route path="/donor/dashboard" element={<DonorDashboard />} />
          <Route path="/congregation/dashboard" element={<CongregationDashboard />} />
          <Route path="/class/dashboard" element={<ClassDashboard />} />
          <Route path="/assets/dashboard" element={<AssetDashboard />} />

          {/* ------------------------------
                      ASSETS MODULE
          --------------------------------*/}
          <Route path="/assets/assets" element={<AssetsPage />} />
          <Route path="/assets/add" element={<AddAssetPage />} />
          <Route path="/assets/depreciation" element={<DepreciationPage />} />
          <Route path="/assets/maintenance" element={<MaintenancePage />} />
          <Route path="/assets/categories" element={<CategoriesPage />} />

          {/* ------------------------------
              DONOR MANAGEMENT ROUTES
          --------------------------------*/}
          <Route path="/donor/donors" element={<DonorsPage />} />
          <Route path="/donor/addDonor" element={<AddDonorPage />} />
          <Route path="/donor/donations" element={<DonationsManagementPage />} />
          <Route path="/donor/addDonation" element={<AddDonationPage />} />
          <Route path="/donor/donorCategories" element={<DonorCategoriesPage />} />
          
          {/* ------------------------------
                CONGREGATION SUB-ROUTES
          --------------------------------*/}
          <Route path="/congregation/members" element={<ChurchMembersDashboard />} />
          <Route path="/congregation/attendance" element={<AttendancePage />} />
          <Route path="/congregation/recordAttendance" element={<RecordAttendance />} />
          <Route path="/congregation/followups" element={<CongregationDashboard />} />
          <Route path="/congregation/memberRecords" element={<MembersRecords />} />
          <Route path="congregation/addMember" element={<AddMemberPage />} />

          {/* ------------------------------
                    FINANCE SUB-ROUTES
          --------------------------------*/}
          <Route path="/finance/transactions" element={<FinanceDashboard />} />
          <Route path="/finance/expensetracker" element={<ExpenseTrackerPage />} />
          <Route path="/finance/incometracker" element={<IncomeTrackerPage />} />
          <Route path="/finance/expenseDashboard" element={<ExpenseDashboardPage />} />
          <Route path="/finance/incomeDashboard" element={<IncomeDashboardPage />} />
          <Route path="/finance/addExpense" element={<AddExpensePage />} />
          <Route path="/finance/addIncome" element={<AddIncomePage />} />
          <Route path="/finance/payroll" element={<PayrollPage />} />
          <Route path="/finance/financeCategory" element={<FinanceCategoryPage />} />

          {/* NEW BUDGET ROUTES */}
          <Route path="/finance/budgets" element={<BudgetsPage />} />       {/* Dashboard view */}
          <Route path="/finance/setBudget" element={<SetBudgetsPage />} /> {/* Set budgets form */}

          <Route path="/finance/reports" element={<FinanceDashboard />} />

          {/* ------------------------------
                HR SUB-ROUTES
          --------------------------------*/}
          <Route path="/hr/staffDirectory" element={<StaffDirectory />} />
          <Route path="/hr/attendance" element={<HRDashboard />} />
          <Route path="/hr/leave" element={<LeaveManagementPage />} />
          <Route path="/hr/departments" element={<DepartmentsPage />} />
          <Route path="/hr/addStaff" element={<AddStaffPage />} />

          {/* ------------------------------
                    PROGRAMS SUB-ROUTES
          --------------------------------*/}
          <Route path="/programs/donors" element={<ProgramsDashboard />} />
          <Route path="/programs/addDonor" element={<ProgramsDashboard />} />
          <Route path="/programs/donations" element={<ProgramsDashboard />} />
          <Route path="/programs/reports" element={<ProgramsDashboard />} />

          {/* ------------------------------
                      CLASS MODULE
          --------------------------------*/}
          <Route path="/class/classes" element={<ClassDashboard />} />
          <Route path="/class/add-class" element={<ClassDashboard />} />
          <Route path="/class/teachers" element={<ClassDashboard />} />
          <Route path="/class/enrollments" element={<ClassDashboard />} />
          <Route path="/class/attendance" element={<ClassDashboard />} />
          <Route path="/class/reports" element={<ClassDashboard />} />

          {/* ------------------------------
                  MINISTRY SUB-ROUTES
          --------------------------------*/}
          <Route path="/ministry/teams" element={<MinistryDashboard />} />
          <Route path="/ministry/members" element={<MinistryDashboard />} />
          <Route path="/ministry/reports" element={<MinistryDashboard />} />
          <Route path="/ministry/pastors" element={<PastorsPage />} />

          {/* ------------------------------
                  PASTORAL SUB-ROUTES
          --------------------------------*/}
          <Route path="/pastoral/donors" element={<PastoralDashboard />} />
          <Route path="/pastoral/add-donor" element={<PastoralDashboard />} />
          <Route path="/pastoral/donations" element={<PastoralDashboard />} />
          <Route path="/pastoral/reports" element={<PastoralDashboard />} />

          {/* ------------------------------
                GOVERNANCE SUB-ROUTES
          --------------------------------*/}
          <Route path="/governance/policies" element={<GovernanceDashboard />} />
          <Route path="/governance/audit-reports" element={<GovernanceDashboard />} />
          <Route path="/governance/compliance-logs" element={<GovernanceDashboard />} />
          <Route path="/governance/documentation" element={<GovernanceDashboard />} />
          <Route path="/governance/certificates" element={<GovernanceDashboard />} />

          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
