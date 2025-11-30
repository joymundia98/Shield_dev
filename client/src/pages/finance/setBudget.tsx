import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

interface BudgetCategories {
  [category: string]: string[];
}

interface Budgets {
  [category: string]: { [subCategory: string]: number };
}

const SetBudgetsPage: React.FC = () => {
  const navigate = useNavigate();

  // ---------------- Sidebar State ----------------
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    if (sidebarOpen) document.body.classList.add("sidebar-open");
    else document.body.classList.remove("sidebar-open");
  }, [sidebarOpen]);

  // ---------------- Categories ----------------
  const budgetCategories: BudgetCategories = {
    "Operational Expenses": ["Rent", "Utilities", "Office Supplies", "Equipment & Software"],
    "Employee Expenses": ["Salaries & Wages", "Reimbursements"],
    "Project / Department Expenses": ["Project Costs", "Materials / Consultants / Outsourcing"],
    "Financial & Regulatory Expenses": ["Taxes, Fees, Insurance", "Compliance Costs"],
    "Capital Expenses": ["Investments / Assets"]
  };

  // ---------------- Budget State ----------------
  const [budgets, setBudgets] = useState<Budgets>({});

  // Initialize budget state with zeros
  useEffect(() => {
    const initialBudgets: Budgets = {};
    for (const cat in budgetCategories) {
      initialBudgets[cat] = {};
      budgetCategories[cat].forEach(sub => {
        initialBudgets[cat][sub] = 0;
      });
    }
    setBudgets(initialBudgets);
  }, []);

  // ---------------- Handle Input Change ----------------
  const handleChange = (category: string, subCategory: string, value: string) => {
    setBudgets(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subCategory]: parseFloat(value) || 0
      }
    }));
  };

  // ---------------- Save Budgets ----------------
  const saveBudgets = () => {
    console.log("Budgets Saved:", budgets);
    alert("Budgets have been saved successfully!");
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
        <a href="/finance/expensetracker">Track Expenses</a>
        <a href="/finance/budgets" className="active">Budget</a>
        <a href="/finance/payroll">Payroll</a>
        <a href="/finance/financeCategory">Finance Categories</a>

        <hr className="sidebar-separator" />
        <a href="/dashboard" className="return-main">← Back to Main Dashboard</a>
        <a href="/" className="logout-link" onClick={(e) => { e.preventDefault(); localStorage.clear(); navigate("/"); }}>➜ Logout</a>
      </div>

      {/* Main Content */}
      <div className="dashboard-content container">
        <header>
          <h1>Budget Setup</h1>
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <button className="add-btn" onClick={() => navigate("/finance/expensetracker")}>
              Expenses
            </button>
            <button className="add-btn" onClick={() => navigate("/finance/incometracker")}>
              Income
            </button>
          </div>
        </header>

        <br />

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
          <button className="add-btn" onClick={() => navigate("/finance/budgets")}>
            Budget Summary
          </button>
        </div>

        <h2>Set Budget for Categories</h2>

        {/* Render Budget Form with Cards */}
        {Object.entries(budgetCategories).map(([category, subCategories]) => (
          <div className="budget-card" key={category}>
            <h3 className="budget-card-title">{category}</h3>

            {subCategories.map(sub => (
              <div className="budget-input-row" key={sub}>
                <label>{sub}</label>
                <input
                  type="number"
                  min={0}
                  placeholder="Enter budget"
                  value={budgets[category]?.[sub] || ""}
                  onChange={(e) => handleChange(category, sub, e.target.value)}
                />
              </div>
            ))}
          </div>
        ))}

        <button className="add-btn" onClick={saveBudgets} style={{ marginTop: "20px" }}>
          Save Budgets
        </button>
      </div>
    </div>
  );
};

export default SetBudgetsPage;
