import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

interface ExpenseRecord {
  category: string;
  description: string;
  amount: number;
  date: string;
  department: string;
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const ExpensePage: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ------------------- Expense Data -------------------
  const [expenseData, setExpenseData] = useState<ExpenseRecord[]>([
    { category: "Rent", description: "Office Rent November", amount: 5000, date: "2025-11-01", department: "Finance" },
    { category: "Utilities", description: "Electricity Bill", amount: 800, date: "2025-11-05", department: "Operations" },
    { category: "Requisition", description: "Office Supplies", amount: 300, date: "2025-11-10", department: "Admin" },
  ]);

  const [search, setSearch] = useState("");
  const [filterMonth, setFilterMonth] = useState<string | "all">("all");
  const [filterYear, setFilterYear] = useState<number | "all">("all");
  const [filterDepartment, setFilterDepartment] = useState<string | "all">("all");

  // ------------------- Modal State -------------------
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [modalRecord, setModalRecord] = useState<ExpenseRecord>({
    category: "Rent",
    description: "",
    amount: 0,
    date: "",
    department: "",
  });

  // ------------------- Sidebar -------------------
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  useEffect(() => {
    if (sidebarOpen) document.body.classList.add("sidebar-open");
    else document.body.classList.remove("sidebar-open");
  }, [sidebarOpen]);

  // ------------------- Filtered Expenses -------------------
  const filteredExpenses = useMemo(() => {
    return expenseData.filter((rec) => {
      const dateObj = new Date(rec.date);
      if (filterMonth !== "all" && monthNames[dateObj.getMonth()] !== filterMonth) return false;
      if (filterYear !== "all" && dateObj.getFullYear() !== filterYear) return false;
      if (filterDepartment !== "all" && rec.department !== filterDepartment) return false;
      if (search && !JSON.stringify(rec).toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [expenseData, filterMonth, filterYear, filterDepartment, search]);

  // ------------------- Group by Department -------------------
  const groupedByDepartment = useMemo(() => {
    const groups: Record<string, ExpenseRecord[]> = {};
    filteredExpenses.forEach((rec) => {
      if (!groups[rec.department]) groups[rec.department] = [];
      groups[rec.department].push(rec);
    });
    return groups;
  }, [filteredExpenses]);

  // ------------------- KPI Calculations -------------------
  const selectedMonthIndex = filterMonth === "all" ? new Date().getMonth() : monthNames.indexOf(filterMonth);
  const selectedYearValue = filterYear === "all" ? new Date().getFullYear() : filterYear;

  const expensesThisMonth = expenseData.filter((p) => {
    const d = new Date(p.date);
    return d.getMonth() === selectedMonthIndex && d.getFullYear() === selectedYearValue;
  });

  const kpiTotalExpenses = expensesThisMonth.reduce((sum, p) => sum + p.amount, 0);
  const kpiRent = expensesThisMonth.filter((p) => p.category === "Rent").reduce((sum, p) => sum + p.amount, 0);
  const kpiUtilities = expensesThisMonth.filter((p) => p.category === "Utilities").reduce((sum, p) => sum + p.amount, 0);
  const kpiRequisitions = expensesThisMonth.filter((p) => p.category === "Requisition").reduce((sum, p) => sum + p.amount, 0);
  const kpiReserveFunds = 50000; // static example

  // ------------------- Modal Handlers -------------------
  const openAddModal = () => {
    setEditingIndex(null);
    setModalRecord({ category: "Rent", description: "", amount: 0, date: "", department: "" });
    setShowModal(true);
  };

  const openEditModal = (index: number) => {
    setEditingIndex(index);
    setModalRecord(expenseData[index]);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleSave = () => {
    if (editingIndex === null) {
      setExpenseData((prev) => [...prev, modalRecord]);
    } else {
      setExpenseData((prev) => prev.map((p, i) => (i === editingIndex ? modalRecord : p)));
    }
    closeModal();
  };

  return (
    <div className="dashboard-wrapper">
      {/* Hamburger */}
      <button className="hamburger" onClick={toggleSidebar}>&#9776;</button>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <h2>FINANCE</h2>
        <a href="/finance/dashboard">Dashboard</a>
        <a href="/finance/add-transaction">Add Transaction</a>
        <a href="/finance/transactions">Transactions</a>
        <a href="/finance/expenses" className="active">Expenses</a>
        <a href="/finance/reports">Reports</a>
        <a href="/finance/budgets">Budgets</a>
        <hr className="sidebar-separator" />
        <a href="/dashboard" className="return-main">← Back to Main Dashboard</a>
        <a href="/" className="logout-link" onClick={(e) => { e.preventDefault(); localStorage.clear(); navigate("/"); }}>➜ Logout</a>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        <h1>Expense Tracking</h1>

        {/* Search + Add */}
        <div className="table-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <input
            type="text"
            className="search-input"
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="add-btn" onClick={openAddModal}>+ Add Expense</button>
        </div>

        {/* Filters */}
        <div className="filters" style={{ margin: "10px 0", display: "flex", gap: "10px" }}>
          <label>
            Month:
            <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
              <option value="all">All</option>
              {monthNames.map((month) => <option key={month} value={month}>{month}</option>)}
            </select>
          </label>
          <label>
            Year:
            <select value={filterYear} onChange={(e) => setFilterYear(e.target.value === "all" ? "all" : parseInt(e.target.value))}>
              <option value="all">All</option>
              {[2020,2021,2022,2023,2024,2025].map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </label>
          <label>
            Department:
            <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
              <option value="all">All</option>
              {Array.from(new Set(expenseData.map(p => p.department))).map(dep => <option key={dep} value={dep}>{dep}</option>)}
            </select>
          </label>
        </div>

        {/* KPI Cards */}
        <div className="kpi-container">
          <div className="kpi-card"><h3>Total Expenses</h3><p>${kpiTotalExpenses.toLocaleString()}</p></div>
          <div className="kpi-card"><h3>Reserve Funds</h3><p>${kpiReserveFunds.toLocaleString()}</p></div>
          <div className="kpi-card"><h3>Rent</h3><p>${kpiRent.toLocaleString()}</p></div>
          <div className="kpi-card"><h3>Utilities</h3><p>${kpiUtilities.toLocaleString()}</p></div>
          <div className="kpi-card"><h3>Requisitions</h3><p>${kpiRequisitions.toLocaleString()}</p></div>
        </div>

        {/* Expense Table Grouped by Department */}
        {Object.entries(groupedByDepartment).map(([dept, records]) => (
          <div key={dept} style={{ marginTop: "20px" }}>
            <h2>{dept} Department</h2>
            <table className="responsive-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((p, i) => (
                  <tr key={i}>
                    <td>{p.date}</td>
                    <td>{p.category}</td>
                    <td>{p.description}</td>
                    <td>${p.amount.toLocaleString()}</td>
                    <td>
                      <button className="edit-btn" onClick={() => openEditModal(expenseData.indexOf(p))}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        {/* Modal */}
        <div className="overlay" style={{ display: showModal ? "block" : "none" }} onClick={closeModal}></div>
        <div className="filter-popup modal-wide" style={{ display: showModal ? "block" : "none" }}>
          <h3>{editingIndex === null ? "Add Expense" : "Edit Expense"}</h3>

          <label>Category</label>
          <select value={modalRecord.category} onChange={(e) => setModalRecord({ ...modalRecord, category: e.target.value })}>
            <option value="Rent">Rent</option>
            <option value="Utilities">Utilities</option>
            <option value="Requisition">Requisition</option>
            <option value="Salaries">Salaries</option>
            <option value="Miscellaneous">Miscellaneous</option>
          </select>

          <label>Description</label>
          <input type="text" value={modalRecord.description} onChange={(e) => setModalRecord({ ...modalRecord, description: e.target.value })} />

          <label>Amount</label>
          <input type="number" value={modalRecord.amount} onChange={(e) => setModalRecord({ ...modalRecord, amount: parseFloat(e.target.value) })} />

          <label>Department</label>
          <input type="text" value={modalRecord.department} onChange={(e) => setModalRecord({ ...modalRecord, department: e.target.value })} />

          <label>Date</label>
          <input type="date" value={modalRecord.date} onChange={(e) => setModalRecord({ ...modalRecord, date: e.target.value })} />

          <div className="filter-popup-buttons">
            <button className="add-btn" onClick={handleSave}>Save</button>
            <button className="delete-btn" onClick={closeModal}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensePage;
