import React, { useState, useMemo, useEffect } from "react";
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
import { Doughnut, Bar } from "react-chartjs-2";
import "../../styles/global.css";

ChartJS.register(CategoryScale, LinearScale, ArcElement, BarElement, Tooltip, Legend);

interface BudgetCategory {
  name: string;
  allocated: number;
  spent: number;
}

const BudgetsPage: React.FC = () => {
  const navigate = useNavigate();

  // ---------------- Sidebar State ----------------
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // ---------------- Sidebar Effect ----------------
  useEffect(() => {
    if (sidebarOpen) document.body.classList.add("sidebar-open");
    else document.body.classList.remove("sidebar-open");
  }, [sidebarOpen]);

  // ---------------- Static Budget Data ----------------
  const budgetData: BudgetCategory[] = [
    { name: "Operational Expenses", allocated: 8000, spent: 5000 },
    { name: "Employee Expenses", allocated: 5000, spent: 4000 },
    { name: "Project Expenses", allocated: 4000, spent: 3800 },
    { name: "Financial Expenses", allocated: 3000, spent: 3200 },
    { name: "Capital Expenses", allocated: 5000, spent: 5200 }
  ];

  // ---------------- KPIs ----------------
  const totalBudget = budgetData.reduce((sum, b) => sum + b.allocated, 0);
  const totalSpent = budgetData.reduce((sum, b) => sum + b.spent, 0);
  const remainingBudget = totalBudget - totalSpent;
  const overspentCategories = budgetData.filter(b => b.spent > b.allocated).length;

  // ---------------- Chart Data ----------------
  const categoryChartData = useMemo(() => ({
    labels: budgetData.map(b => b.name),
    datasets: [
      {
        label: "Budget Allocation",
        data: budgetData.map(b => b.allocated),
        backgroundColor: ["#ff7f50", "#2E3B55", "#5C4736", "#AF907A", "#817E7A"]
      }
    ]
  }), [budgetData]);

  const budgetVsExpenseChartData = useMemo(() => ({
    labels: budgetData.map(b => b.name),
    datasets: [
      {
        label: "Budget",
        data: budgetData.map(b => b.allocated),
        backgroundColor: "#2E3B55"
      },
      {
        label: "Spent",
        data: budgetData.map(b => b.spent),
        backgroundColor: "#ff7f50"
      }
    ]
  }), [budgetData]);

  return (
    <div className="dashboard-wrapper">

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
        <a href="/finance/incometracker">Track Income</a>
        <a href="/finance/expensetracker">Track Expenses</a>
        <a href="/finance/budgets" className="active">Budget</a>
        <a href="/finance/payroll">Payroll</a>
        <a href="/finance/financeCategory">Finance Categories</a>

        <hr className="sidebar-separator" />
        <a href="/dashboard" className="return-main">← Back to Main Dashboard</a>
        <a href="/" className="logout-link" onClick={(e) => { e.preventDefault(); localStorage.clear(); navigate("/"); }}>➜ Logout</a>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">

        {/* Header */}
        <header className="page-header">
          <h1>Budget Overview</h1>
          <button className="hamburger" onClick={toggleSidebar}>
            &#9776;
          </button>
        </header>

        <br/>
        <button className="add-btn" onClick={() => navigate("/finance/setBudget")}>
          Set Budget
        </button>

        <br /><br />

        {/* KPI Cards */}
        <div className="kpi-container">
          <div className="kpi-card">
            <h3>Total Budget Allocated</h3>
            <p>${totalBudget.toLocaleString()}</p>
          </div>

          <div className="kpi-card">
            <h3>Total Spent</h3>
            <p>${totalSpent.toLocaleString()}</p>
          </div>

          <div className="kpi-card">
            <h3>Remaining Budget</h3>
            <p>${remainingBudget.toLocaleString()}</p>
          </div>

          <div className="kpi-card">
            <h3>Overspent Categories</h3>
            <p>{overspentCategories}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="chart-grid">
          <div className="chart-box">
            <h3>Budget Allocation by Category</h3>
            <Doughnut data={categoryChartData} options={{ responsive: true, plugins: { legend: { position: "right" } } }} />
          </div>

          <div className="chart-box">
            <h3>Expenses vs Budget (Top 5)</h3>
            <Bar data={budgetVsExpenseChartData} options={{ responsive: true, plugins: { legend: { position: "top" } }, scales: { y: { beginAtZero: true } } }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetsPage;
