import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

interface ExtraFields {
  [key: string]: string;
}

interface NewExpense {
  category: string;
  subcategory: string;
  date: string;
  department: string;
  description: string;
  amount: number;
  attachments: File[];
  extraFields: ExtraFields;
}

const categoryMap: Record<string, string[]> = {
  "Operational Expenses": ["Rent", "Utilities", "Office Supplies", "Equipment & Software"],
  "Employee Expenses": ["Salaries & Wages", "Reimbursements"],
  "Project / Department Expenses": ["Project Costs", "Materials / Consultants / Outsourcing"],
  "Financial & Regulatory Expenses": ["Taxes, Fees, Insurance", "Compliance Costs"],
  "Capital Expenses": ["Investments / Assets"],
};

const AddExpense: React.FC = () => {
  const navigate = useNavigate();

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    if (sidebarOpen) document.body.classList.add("sidebar-open");
    else document.body.classList.remove("sidebar-open");
  }, [sidebarOpen]);

  // Form State
  const [form, setForm] = useState<NewExpense>({
    category: "",
    subcategory: "",
    date: "",
    department: "",
    description: "",
    amount: 0,
    attachments: [],
    extraFields: {},
  });

  const [subcategories, setSubcategories] = useState<string[]>([]);

  // Handle category change
  const handleCategoryChange = (cat: string) => {
    setForm({ ...form, category: cat, subcategory: "", extraFields: {} });
    setSubcategories(categoryMap[cat] || []);
  };

  // Handle subcategory change
  const handleSubcategoryChange = (sub: string) => {
    setForm({ ...form, subcategory: sub, extraFields: {} });
  };

  // Handle extra field changes
  const handleExtraFieldChange = (key: string, value: string) => {
    setForm({ ...form, extraFields: { ...form.extraFields, [key]: value } });
  };

  // Handle attachment uploads
  const handleAttachments = (files: FileList | null) => {
    if (!files) return;
    setForm({ ...form, attachments: Array.from(files) });
  };

  // Submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted expense:", form);
    alert("Expense submitted successfully!");
    navigate("/finance/expensetracker");
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="close-wrapper">
          <div className="toggle close-btn">
            <input type="checkbox" checked={sidebarOpen} onChange={toggleSidebar} />
            <span className="button"></span>
            <span className="label">X</span>
          </div>
        </div>

        <h2>EXPENSES</h2>
        <h2>FINANCE</h2>
        <a href="/finance/dashboard">Dashboard</a>
        <a href="/finance/incometracker">Track Income</a>
        <a href="/finance/expensetracker" className="active">Track Expenses</a>
        <a href="/finance/budgets">Budget</a>
        <a href="/finance/payroll">Payroll</a>
        <a href="/finance/financeCategory">Finance Categories</a>

        <hr className="sidebar-separator" />
        <a href="/dashboard" className="return-main">← Back to Main Dashboard</a>
        <a
          href="/"
          className="logout-link"
          onClick={(e) => { e.preventDefault(); localStorage.clear(); navigate("/"); }}
        >
          ➜ Logout
        </a>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        <header className="page-header expense-header">
          <h1>Add Expense</h1>
          <div>
            <button className="add-btn" style={{ margin: "10px 0" }} onClick={() => navigate("/finance/expensetracker")}>
              ← Back
            </button>
            <button className="hamburger" onClick={toggleSidebar}>
              &#9776;
            </button>
          </div>
        </header>

        <div className="container">
          <h2 style={{ marginBottom: 20, textAlign: "center" }}>New Expense Details</h2>

          <form className="add-form-styling" onSubmit={handleSubmit}>
            {/* Category */}
            <label>Expense Category</label>
            <select value={form.category} required onChange={(e) => handleCategoryChange(e.target.value)}>
              <option value="">Select Category</option>
              {Object.keys(categoryMap).map(cat => <option key={cat}>{cat}</option>)}
            </select>

            {/* Subcategory */}
            <label>Subcategory</label>
            <select value={form.subcategory} required onChange={(e) => handleSubcategoryChange(e.target.value)}>
              <option value="">Select Subcategory</option>
              {subcategories.map(sub => <option key={sub}>{sub}</option>)}
            </select>

            {/* Date */}
            <label>Expense Date</label>
            <input type="date" value={form.date} required onChange={(e) => setForm({ ...form, date: e.target.value })} />

            {/* Department / Project */}
            <label>Department / Project</label>
            <input type="text" value={form.department} placeholder="e.g. Finance, Marketing, Project A" required
              onChange={(e) => setForm({ ...form, department: e.target.value })} />

            {/* Description */}
            <label>Description</label>
            <textarea value={form.description} placeholder="What is the expense for?" required
              onChange={(e) => setForm({ ...form, description: e.target.value })} />

            {/* Amount */}
            <label>Amount ($)</label>
            <input type="number" min={0} step={0.01} required value={form.amount}
              onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) })} />

            {/* Attachments */}
            <label>Upload Documents</label>
            <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={(e) => handleAttachments(e.target.files)} />
            <p className="small-note">Attach invoices, receipts, payroll sheets, quotations, etc.</p>

            {/* Dynamic Extra Fields */}
            {form.subcategory === "Salaries & Wages" && (
              <>
                <label>Payroll Period</label>
                <input type="text" placeholder="e.g. Nov 2025"
                  value={form.extraFields.payrollPeriod || ""} 
                  onChange={(e) => handleExtraFieldChange("payrollPeriod", e.target.value)} />

                <label>Employee Name</label>
                <input type="text" placeholder="Optional"
                  value={form.extraFields.employeeName || ""} 
                  onChange={(e) => handleExtraFieldChange("employeeName", e.target.value)} />
              </>
            )}

            {form.subcategory === "Reimbursements" && (
              <>
                <label>Reimbursement Type</label>
                <select value={form.extraFields.reimbursementType || ""} 
                  onChange={(e) => handleExtraFieldChange("reimbursementType", e.target.value)}>
                  <option>Travel</option>
                  <option>Meals</option>
                  <option>Supplies</option>
                  <option>Other</option>
                </select>
              </>
            )}

            <button type="submit" className="add-btn" style={{ marginTop: 20 }}>Submit Expense</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;
