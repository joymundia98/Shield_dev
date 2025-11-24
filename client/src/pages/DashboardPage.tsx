import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";
import "../styles/global.css";

interface KPI {
  totalMembers: number;
  weeklyAttendance: number;
  monthlyGiving: number;
  activeVolunteers: number;
}

interface ChartData {
  attendance: number[];
  donations: number[];
}

interface Dropdown {
  label: string;
  links: { name: string; href: string }[];
}

const dropdowns: Dropdown[] = [
  {
    label: "Congregation Management",
    links: [
      { name: "Dashboard", href: "/congregation/dashboard" },
      { name: "Donors", href: "/congregation/donors" },
      { name: "Add Donor", href: "/congregation/add-donor" },
      { name: "Donations", href: "/congregation/donations" },
      { name: "Reports", href: "/congregation/reports" },
    ],
  },
  {
    label: "Finance",
    links: [
      { name: "Dashboard", href: "/finance/dashboard" },
      { name: "Transactions", href: "/finance/transactions" },
      { name: "Budgets", href: "/finance/budgets" },
      { name: "Expenses", href: "/finance/expenses" },
      { name: "Payroll", href: "/finance/payroll" },
      { name: "Reports", href: "/finance/reports" },
    ],
  },
  {
    label: "HR Management",
    links: [
      { name: "Dashboard", href: "/hr/dashboard" },
      { name: "Staff Directory", href: "/hr/staff-directory" },
      { name: "Attendance Management", href: "/hr/attendance" },
      { name: "Leave Management", href: "/hr/leave" },
      { name: "Departments", href: "/hr/departments" },
    ],
  },
  {
    label: "Asset Management",
    links: [
      { name: "Dashboard", href: "/assets/dashboard" },
      { name: "Assets", href: "/assets/assets" },
      { name: "Depreciation Info", href: "/assets/depreciation" },
      { name: "Maintenance", href: "/assets/maintenance" },
      { name: "Categories", href: "/assets/categories" },
    ],
  },
  {
    label: "Program Event Management",
    links: [
      { name: "Dashboard", href: "/programs/dashboard" },
      { name: "Donors", href: "/programs/donors" },
      { name: "Add Donor", href: "/programs/add-donor" },
      { name: "Donations", href: "/programs/donations" },
      { name: "Reports", href: "/programs/reports" },
    ],
  },
  {
    label: "Class Management",
    links: [
      { name: "Dashboard", href: "/class/dashboard" },
      { name: "Classes", href: "/class/classes" },
      { name: "Add Class", href: "/class/add-class" },
      { name: "Teachers", href: "/class/teachers" },
      { name: "Enrollments", href: "/class/enrollments" },
      { name: "Attendance", href: "/class/attendance" },
      { name: "Reports", href: "/class/reports" },
    ],
  },
  {
    label: "Ministry Teams Management",
    links: [
      { name: "Dashboard", href: "/ministry/dashboard" },
      { name: "Donors", href: "/ministry/donors" },
      { name: "Add Donor", href: "/ministry/add-donor" },
      { name: "Donations", href: "/ministry/donations" },
      { name: "Reports", href: "/ministry/reports" },
    ],
  },
  {
    label: "Pastoral Care Counselling",
    links: [
      { name: "Dashboard", href: "/pastoral/dashboard" },
      { name: "Donors", href: "/pastoral/donors" },
      { name: "Add Donor", href: "/pastoral/add-donor" },
      { name: "Donations", href: "/pastoral/donations" },
      { name: "Reports", href: "/pastoral/reports" },
    ],
  },
  {
    label: "Governance & Documents Management",
    links: [
      { name: "Dashboard", href: "/governance/dashboard" },
      { name: "Policies", href: "/governance/policies" },
      { name: "Audit Reports", href: "/governance/audit-reports" },
      { name: "Compliance Logs", href: "/governance/compliance-logs" },
      { name: "Church Documentation", href: "/governance/documentation" },
      { name: "Certificates for Members", href: "/governance/certificates" },
    ],
  },
  {
    label: "Donor Management",
    links: [
      { name: "Dashboard", href: "/donor/dashboard" },
      { name: "Donors", href: "/donor/donors" },
      { name: "Add Donor", href: "/donor/add-donor" },
      { name: "Donations", href: "/donor/donations" },
      { name: "Reports", href: "/donor/reports" },
    ],
  },
];

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [kpi, _setKpi] = useState<KPI>({
    totalMembers: 1248,
    weeklyAttendance: 560,
    monthlyGiving: 34000,
    activeVolunteers: 75,
  });

  const [chartData, _setChartData] = useState<ChartData>({
    attendance: [520, 560, 580, 600],
    donations: [15000, 8000, 5000, 6000],
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownStates, setDropdownStates] = useState<Record<string, boolean>>({});

  const attendanceChartRef = useRef<Chart | null>(null);
  const givingChartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const initialState: Record<string, boolean> = {};
    dropdowns.forEach((d) => (initialState[d.label] = false));
    setDropdownStates(initialState);
  }, []);

  useEffect(() => {
    attendanceChartRef.current?.destroy();
    givingChartRef.current?.destroy();

    const attendanceCtx = document.getElementById(
      "attendanceChart"
    ) as HTMLCanvasElement;
    if (attendanceCtx) {
      attendanceChartRef.current = new Chart(attendanceCtx, {
        type: "line",
        data: {
          labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
          datasets: [
            {
              label: "Weekly Attendance",
              data: chartData.attendance,
              borderColor: "#1A3D7C",
              backgroundColor: "rgba(26,61,124,0.2)",
              fill: true,
              tension: 0.3,
            },
          ],
        },
        options: { responsive: true },
      });
    }

    const givingCtx = document.getElementById("givingChart") as HTMLCanvasElement;
    if (givingCtx) {
      givingChartRef.current = new Chart(givingCtx, {
        type: "pie",
        data: {
          labels: ["General Fund", "Missions", "Building Fund", "Outreach"],
          datasets: [
            {
              data: chartData.donations,
              backgroundColor: ["#5C4736", "#817E7A", "#AF907A", "#20262C"],
            },
          ],
        },
        options: { responsive: true },
      });
    }
  }, [chartData]);

  const toggleDropdown = (label: string) => {
    setDropdownStates((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="dashboard-wrapper">
      {/* Hamburger */}
      {!sidebarOpen && (
        <button className="hamburger" onClick={() => setSidebarOpen(true)}>
          &#9776;
        </button>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`} id="sidebar">
        <div className="close-wrapper">
          <button className="close-btn" onClick={() => setSidebarOpen(false)}>
            X
          </button>
        </div>

        <h2>CHURCH DASHBOARD</h2>
        <a href="#" className="active">
          Dashboard
        </a>

        {dropdowns.map((dropdown) => (
          <div key={dropdown.label}>
            <button
              className={`dropdown-btn ${dropdownStates[dropdown.label] ? "active" : ""}`}
              onClick={() => toggleDropdown(dropdown.label)}
            >
              {dropdown.label}
            </button>
            <div
              className="dropdown-container"
              style={{ display: dropdownStates[dropdown.label] ? "block" : "none" }}
            >
              {dropdown.links.map((link) => (
                <a key={link.name} href={link.href}>
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        ))}

         {/* Two break lines before logout */}
            <br />
            <br />

        <a
          href="#"
          className="logout-link"
          onClick={(e) => {
            e.preventDefault();
            localStorage.clear();
            navigate("/"); // go to LandingPage
          }}
        >
          ➜] &nbsp; Logout
        </a>
      </div>

      {/* Main Dashboard */}
      <div className="dashboard-content">
        <h1>Church Overview</h1>

        <br/><br/>

        <div className="kpi-container">
          <div className="kpi-card">
            <h3>Total Members</h3>
            <p>{kpi.totalMembers}</p>
          </div>
          <div className="kpi-card">
            <h3>Weekly Attendance</h3>
            <p>{kpi.weeklyAttendance}</p>
          </div>
          <div className="kpi-card">
            <h3>Monthly Giving</h3>
            <p>${kpi.monthlyGiving.toLocaleString()}</p>
          </div>
          <div className="kpi-card">
            <h3>Active Volunteers</h3>
            <p>{kpi.activeVolunteers}</p>
          </div>
        </div>

        <div className="chart-grid">
          <div className="chart-box">
            <h3>Attendance Trends</h3>
            <canvas id="attendanceChart"></canvas>
          </div>
          <div className="chart-box">
            <h3>Donations by Fund</h3>
            <canvas id="givingChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
