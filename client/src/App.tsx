import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { LandingPage } from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import PastoralDashboard from './pages/pastoral/dashboard';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Dashboards */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/congregation/dashboard" element={<DashboardPage />} />
          <Route path="/finance/dashboard" element={<DashboardPage />} />
          <Route path="/hr/dashboard" element={<DashboardPage />} />
          <Route path="/assets/dashboard" element={<DashboardPage />} />
          <Route path="/programs/dashboard" element={<DashboardPage />} />
          <Route path="/class/dashboard" element={<DashboardPage />} />
          <Route path="/ministry/dashboard" element={<DashboardPage />} />
          <Route path="/pastoral/dashboard" element={<PastoralDashboard />} />
          <Route path="/governance/dashboard" element={<DashboardPage />} />
          <Route path="/donor/dashboard" element={<DashboardPage />} />

          {/* Other routes from links */}
          <Route path="/congregation/donors" element={<DashboardPage />} />
          <Route path="/congregation/add-donor" element={<DashboardPage />} />
          <Route path="/congregation/donations" element={<DashboardPage />} />
          <Route path="/congregation/reports" element={<DashboardPage />} />

          <Route path="/finance/transactions" element={<DashboardPage />} />
          <Route path="/finance/budgets" element={<DashboardPage />} />
          <Route path="/finance/expenses" element={<DashboardPage />} />
          <Route path="/finance/payroll" element={<DashboardPage />} />
          <Route path="/finance/reports" element={<DashboardPage />} />

          <Route path="/hr/staff-directory" element={<DashboardPage />} />
          <Route path="/hr/attendance" element={<DashboardPage />} />
          <Route path="/hr/leave" element={<DashboardPage />} />
          <Route path="/hr/departments" element={<DashboardPage />} />

          <Route path="/assets/assets" element={<DashboardPage />} />
          <Route path="/assets/depreciation" element={<DashboardPage />} />
          <Route path="/assets/maintenance" element={<DashboardPage />} />
          <Route path="/assets/categories" element={<DashboardPage />} />

          <Route path="/programs/donors" element={<DashboardPage />} />
          <Route path="/programs/add-donor" element={<DashboardPage />} />
          <Route path="/programs/donations" element={<DashboardPage />} />
          <Route path="/programs/reports" element={<DashboardPage />} />

          <Route path="/class/classes" element={<DashboardPage />} />
          <Route path="/class/add-class" element={<DashboardPage />} />
          <Route path="/class/teachers" element={<DashboardPage />} />
          <Route path="/class/enrollments" element={<DashboardPage />} />
          <Route path="/class/attendance" element={<DashboardPage />} />
          <Route path="/class/reports" element={<DashboardPage />} />

          <Route path="/ministry/donors" element={<DashboardPage />} />
          <Route path="/ministry/add-donor" element={<DashboardPage />} />
          <Route path="/ministry/donations" element={<DashboardPage />} />
          <Route path="/ministry/reports" element={<DashboardPage />} />

          <Route path="/pastoral/donors" element={<DashboardPage />} />
          <Route path="/pastoral/add-donor" element={<DashboardPage />} />
          <Route path="/pastoral/donations" element={<DashboardPage />} />
          <Route path="/pastoral/reports" element={<DashboardPage />} />

          <Route path="/governance/policies" element={<DashboardPage />} />
          <Route path="/governance/audit-reports" element={<DashboardPage />} />
          <Route path="/governance/compliance-logs" element={<DashboardPage />} />
          <Route path="/governance/documentation" element={<DashboardPage />} />
          <Route path="/governance/certificates" element={<DashboardPage />} />

          <Route path="/donor/donors" element={<DashboardPage />} />
          <Route path="/donor/add-donor" element={<DashboardPage />} />
          <Route path="/donor/donations" element={<DashboardPage />} />
          <Route path="/donor/reports" element={<DashboardPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
