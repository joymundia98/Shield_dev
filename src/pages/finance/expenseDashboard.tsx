import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

interface ExpenseCategory {
  id: number;
  name: string;
}

interface ExpenseSubcategory {
  id: number;
  category_id: number;
  name: string;
}

interface Department {
  id: number;
  name: string;
}

interface Expense {
  id: number;
  subcategory_id: number;
  department_id: number | null;
  amount: string; // string in DB
  date: string;
  approvedDate: string;
  status: "Approved" | "Pending" | "Rejected";
}

const BACKEND_URL = "http://localhost:3000/api";

const ExpenseDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // ------------------- Sidebar -------------------
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    if (sidebarOpen) document.body.classList.add("sidebar-open");
    else document.body.classList.remove("sidebar-open");
  }, [sidebarOpen]);

  // ------------------- Data State -------------------
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [subcategories, setSubcategories] = useState<ExpenseSubcategory[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // ------------------- Fetch from Backend -------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, subRes, deptRes, expenseRes] = await Promise.all([
          axios.get(`${BACKEND_URL}/finance/expense_categories`),
          axios.get(`${BACKEND_URL}/finance/expense_subcategories`),
          axios.get(`${BACKEND_URL}/departments`),
          axios.get(`${BACKEND_URL}/finance/expenses`)
        ]);

        setCategories(catRes.data);
        setSubcategories(subRes.data);
        setDepartments(deptRes.data);
        setExpenses(expenseRes.data);
      } catch (err) {
        console.error("Failed to fetch expense data", err);
      }
    };

    fetchData();
  }, []);

  // ------------------- Map Expenses to Categories & Departments -------------------
  const expensesWithCategory = useMemo(() => {
    const subMap = Object.fromEntries(subcategories.map(s => [s.id, s]));
    const catMap = Object.fromEntries(categories.map(c => [c.id, c]));
    const deptMap = Object.fromEntries(departments.map(d => [d.id, d]));

    return expenses.map(e => {
      const sub = subMap[e.subcategory_id];
      const cat = sub ? catMap[sub.category_id] : null;
      const dept = e.department_id ? deptMap[e.department_id] : null;
      return {
        ...e,
        categoryName: cat ? cat.name : "Unknown",
        subcategoryName: sub ? sub.name : "Unknown",
        department: dept ? dept.name : "N/A",
        amountNum: parseFloat(e.amount)
      };
    });
  }, [expenses, subcategories, categories, departments]);

  // ------------------- KPIs -------------------
  const totalExpenses = useMemo(
    () => expensesWithCategory.reduce((sum, e) => sum + e.amountNum, 0),
    [expensesWithCategory]
  );

  const today = new Date().getDate();
  const burnRate = (totalExpenses / today).toFixed(2);

  const reserveFunds = 50000 - totalExpenses; // Example total reserve

  // ------------------- Charts -------------------
  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    expensesWithCategory.forEach(e => {
      totals[e.categoryName] = (totals[e.categoryName] || 0) + e.amountNum;
    });
    return totals;
  }, [expensesWithCategory]);

  const departmentTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    expensesWithCategory.forEach(e => {
      totals[e.department] = (totals[e.department] || 0) + e.amountNum;
    });
    return totals;
  }, [expensesWithCategory]);

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
        <a href="/finance/incometracker">Track Income</a>
        <a href="/finance/expensetracker" className="active">Track Expenses</a>
        <a href="/finance/budgets">Budget</a>
        <a href="/finance/payroll">Payroll</a>
        <a href="/finance/financeCategory">Finance Categories</a>

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
        {/* HEADER */}
        <header className="page-header expense-header">
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
          <div className="chart-box">
            <h3>Spend by Category</h3>
            <Bar data={categoryChartData} options={{ responsive: true }} />
          </div>
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
