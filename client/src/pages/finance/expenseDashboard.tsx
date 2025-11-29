import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";
import "../../styles/global.css";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Tooltip,
  Legend
);

interface Expense {
  category: string;
  department: string;
  amount: number;
  date: string;
  approvedDate: string;
}

const ExpenseDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // ------------------- Sidebar -------------------
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    if (sidebarOpen) document.body.classList.add("sidebar-open");
    else document.body.classList.remove("sidebar-open");
  }, [sidebarOpen]);

  // ------------------- Approved Expenses (Static for Now) -------------------
  const approvedExpenses: Expense[] = [
    { category: "Rent", department: "Finance", amount: 5000, date: "2025-11-01", approvedDate: "2025-11-02" },
    { category: "Utilities", department: "Operations", amount: 800, date: "2025-11-05", approvedDate: "2025-11-07" },
    { category: "Reimbursements", department: "Admin", amount: 300, date: "2025-11-05", approvedDate: "2025-11-06" },
    { category: "Project Costs", department: "Project A", amount: 1500, date: "2025-11-07", approvedDate: "2025-11-09" },
    { category: "Capital Expense", department: "Operations", amount: 12000, date: "2025-11-08", approvedDate: "2025-11-09" },
    { category: "Capital Expense", department: "Logistics", amount: 25000, date: "2025-11-10", approvedDate: "2025-11-11" }
  ];

  // ------------------- KPIs -------------------
  const totalExpenses = approvedExpenses.reduce((sum, e) => sum + e.amount, 0);
  const today = new Date().getDate();
  const burnRate = (totalExpenses / today).toFixed(2);

  const reserveFunds = 50000 - totalExpenses;

  // ------------------- Category Chart Data -------------------
  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    approvedExpenses.forEach(e => {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
    });
    return totals;
  }, [approvedExpenses]);

  const categoryChartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: "Spend per Category",
        data: Object.values(categoryTotals),
        backgroundColor: "#1A3D7C"
      }
    ]
  };

  // ------------------- Department Chart Data -------------------
  const departmentTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    approvedExpenses.forEach(e => {
      totals[e.department] = (totals[e.department] || 0) + e.amount;
    });
    return totals;
  }, [approvedExpenses]);

  const departmentChartData = {
    labels: Object.keys(departmentTotals),
    datasets: [
      {
        label: "Spend per Department",
        data: Object.values(departmentTotals),
        backgroundColor: ["#5C4736", "#817E7A", "#AF907A", "#20262C", "#858796"]
      }
    ]
  };

  return (
    <div className="dashboard-wrapper">
      
      {/* Hamburger */}
      <button className="hamburger" onClick={toggleSidebar}>
        &#9776;
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="close-wrapper">
          <div className="toggle close-btn">
            <input
              type="checkbox"
              checked={sidebarOpen}
              onChange={toggleSidebar}
            />
            <span className="button"></span>
            <span className="label">X</span>
          </div>
        </div>

        <h2>FINANCE</h2>
        <a href="/finance/dashboard">Dashboard</a>
        <a href="/finance/add-transaction">Add Transaction</a>
        <a href="/finance/expensetracker" className="active">Track Expenses</a>
        <a href="/finance/expenses">Expenses</a>
        <a href="/finance/payroll">Payroll</a>
        <a href="/finance/reports">Reports</a>
        <a href="/finance/budgets">Budgets</a>

        <hr className="sidebar-separator" />

        <a href="/dashboard" className="return-main">
          ← Back to Main Dashboard
        </a>

        <a
          href="/"
          className="logout-link"
          onClick={(e) => {
            e.preventDefault();
            localStorage.clear();
            navigate("/");
          }}
        >
          ➜ Logout
        </a>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* HEADER  */}
        <header className="page-header expense-header" >
          <h1>Expense Dashboard</h1>

          <div>
            <br /><br />

            <button
              className="add-btn"
              style={{ marginRight: "10px" }}
              onClick={() => navigate("/finance/expensetracker")}
            >
              ← Back to Tracker
            </button>

            <button className="hamburger" onClick={toggleSidebar}>
              &#9776;
            </button>
          </div>
        </header>

        <br /><br />

        {/* KPI Cards */}
        <div className="kpi-container">
          <div className="kpi-card">
            <h3>Total Expenses vs Budget</h3>
            <p>${totalExpenses.toLocaleString()} / $100,000</p>
          </div>

          <div className="kpi-card">
            <h3>Reserve Funds</h3>
            <p>${reserveFunds.toLocaleString()}</p>
          </div>

          <div className="kpi-card">
            <h3>Monthly Burn Rate</h3>
            <p>${burnRate}/day</p>
          </div>
        </div>

        {/* Charts */}
        <div className="chart-grid">

          {/* Category Chart */}
          <div className="chart-box">
            <h3>Spend by Category</h3>
            <Bar data={categoryChartData} options={{ responsive: true }} />
          </div>

          {/* Department Chart */}
          <div className="chart-box">
            <h3>Spend by Department</h3>
            <Pie data={departmentChartData} options={{ responsive: true }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseDashboardPage;
