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
import StaffDirectory from "./pages/hr/staff-directory";
import LeaveManagementPage from "./pages/hr/leave";
import DepartmentsPage from "./pages/hr/departments";

// Asset Module Functional Pages
import AssetsPage from "./pages/assets/assets";
import DepreciationPage from "./pages/assets/depreciation";
import AddAssetPage from "./pages/assets/addAsset";
import MaintenancePage from "./pages/assets/maintenance";

// Ministry Module Functional Pages
import PastorsPage from "./pages/ministry/pastors";

// ✅ NEW — Categories Page
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

          {/* ✅ Correct Route for Categories */}
          <Route path="/assets/categories" element={<CategoriesPage />} />

          {/* ------------------------------
                CONGREGATION SUB-ROUTES
          --------------------------------*/}
          <Route path="/congregation/members" element={<CongregationDashboard />} />
          <Route path="/congregation/families" element={<CongregationDashboard />} />
          <Route path="/congregation/attendance" element={<CongregationDashboard />} />
          <Route path="/congregation/followups" element={<CongregationDashboard />} />
          <Route path="/congregation/reports" element={<CongregationDashboard />} />
          <Route path="/congregation/settings" element={<CongregationDashboard />} />

          {/* ------------------------------
                    FINANCE SUB-ROUTES
          --------------------------------*/}
          <Route path="/finance/transactions" element={<FinanceDashboard />} />
          <Route path="/finance/add-transaction" element={<FinanceDashboard />} />
          <Route path="/finance/expenses" element={<FinanceDashboard />} />
          <Route path="/finance/payroll" element={<FinanceDashboard />} />
          <Route path="/finance/budgets" element={<FinanceDashboard />} />
          <Route path="/finance/reports" element={<FinanceDashboard />} />

          {/* ------------------------------
                HR SUB-ROUTES
        --------------------------------*/}
        <Route path="/hr/staff-directory" element={<StaffDirectory />} />
        <Route path="/hr/attendance" element={<HRDashboard />} />
        <Route path="/hr/leave" element={<LeaveManagementPage />} />
        <Route path="/hr/departments" element={<DepartmentsPage />} />

          {/* ------------------------------
                    PROGRAMS SUB-ROUTES
          --------------------------------*/}
          <Route path="/programs/donors" element={<ProgramsDashboard />} />
          <Route path="/programs/add-donor" element={<ProgramsDashboard />} />
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

          {/* ------------------------------
              DONOR MANAGEMENT SUB-ROUTES
          --------------------------------*/}
          <Route path="/donor/donors" element={<DonorDashboard />} />
          <Route path="/donor/add-donor" element={<DonorDashboard />} />
          <Route path="/donor/donations" element={<DonorDashboard />} />
          <Route path="/donor/reports" element={<DonorDashboard />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
