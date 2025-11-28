import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

interface PayrollRecord {
  name: string;
  position: string;
  salary: number;
  status: "Paid" | "Pending" | "Overdue";
  date: string;
}

const PayrollPage: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ------------------- Payroll Data -------------------
  const [payrollData, setPayrollData] = useState<PayrollRecord[]>([
    { name: "John Doe", position: "Pastor", salary: 1500, status: "Paid", date: "2025-11-10" },
    { name: "Mary Smith", position: "Secretary", salary: 800, status: "Pending", date: "2025-11-15" },
    { name: "James Wilson", position: "Choir Director", salary: 600, status: "Paid", date: "2025-11-10" },
  ]);

  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // ------------------- Modal State -------------------
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [modalRecord, setModalRecord] = useState<PayrollRecord>({
    name: "",
    position: "",
    salary: 0,
    status: "Paid",
    date: "",
  });

  // ------------------- Sidebar -------------------
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  useEffect(() => {
    if (sidebarOpen) document.body.classList.add("sidebar-open");
    else document.body.classList.remove("sidebar-open");
  }, [sidebarOpen]);

  // ------------------- Filtered + Searched Payroll -------------------
  const filteredPayroll = useMemo(() => {
    return payrollData.filter((rec) => {
      if (filterDate && rec.date !== filterDate) return false;
      if (search && !JSON.stringify(rec).toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [payrollData, filterDate, search]);

  // ------------------- KPI Calculations -------------------
  const kpiTotalStaff = payrollData.length;
  const kpiPaid = payrollData.filter((p) => p.status === "Paid").length;
  const kpiPending = payrollData.filter((p) => p.status === "Pending").length;
  const kpiTotalSalary = payrollData.reduce((sum, p) => sum + p.salary, 0);

  // ------------------- Modal Handlers -------------------
  const openAddModal = () => {
    setEditingIndex(null);
    setModalRecord({ name: "", position: "", salary: 0, status: "Paid", date: "" });
    setShowModal(true);
  };

  const openEditModal = (index: number) => {
    setEditingIndex(index);
    setModalRecord(payrollData[index]);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleSave = () => {
    if (editingIndex === null) {
      setPayrollData((prev) => [...prev, modalRecord]);
    } else {
      setPayrollData((prev) => prev.map((p, i) => (i === editingIndex ? modalRecord : p)));
    }
    closeModal();
  };

  return (
    <div className="dashboard-wrapper">
      {/* Hamburger */}
      <button className="hamburger" onClick={toggleSidebar}>
        &#9776;
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`} id="sidebar">
        <div className="close-wrapper">
          <div className="toggle close-btn">
            <input
              type="checkbox"
              id="closeSidebarButton"
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
        <a href="/finance/transactions">Transactions</a>
        <a href="/finance/expenses">Expenses</a>
        <a href="/finance/payroll" className="active">Payroll</a>
        <a href="/finance/reports">Reports</a>
        <a href="/finance/budgets">Budgets</a>

        <hr className="sidebar-separator" />
        <a href="/dashboard" className="return-main">← Back to Main Dashboard</a>

        <a
          href="/"
          className="logout-link"
          onClick={(e) => {
            e.preventDefault();
            localStorage.clear();
            navigate("/");
          }}
        >
          ➜] Logout
        </a>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        <h1>Payroll</h1>

        {/* Search + Add */}
        <div className="table-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <input
            type="text"
            className="search-input"
            placeholder="Search payroll..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="add-btn" onClick={openAddModal}>+ Add Payroll Record</button>
        </div>

        {/* Date Filter */}
        <div className="filters" style={{ margin: "10px 0" }}>
          <label>
            Filter by Payment Date:
            <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
          </label>
        </div>

        {/* KPI Cards */}
        <div className="kpi-container">
          <div className="kpi-card"><h3>Total Staff</h3><p>{kpiTotalStaff}</p></div>
          <div className="kpi-card"><h3>Paid</h3><p>{kpiPaid}</p></div>
          <div className="kpi-card"><h3>Pending</h3><p>{kpiPending}</p></div>
          <div className="kpi-card"><h3>Total Salary</h3><p>${kpiTotalSalary.toLocaleString()}</p></div>
        </div>

        {/* Payroll Table */}
        <table className="responsive-table">
          <thead>
            <tr>
              <th>Staff Name</th>
              <th>Position</th>
              <th>Salary</th>
              <th>Status</th>
              <th>Payment Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayroll.map((p, i) => (
              <tr key={i}>
                <td>{p.name}</td>
                <td>{p.position}</td>
                <td>${p.salary.toLocaleString()}</td>
                <td><span className={`status ${p.status.toLowerCase()}`}>{p.status}</span></td>
                <td>{p.date}</td>
                <td>
                  <button className="edit-btn" onClick={() => openEditModal(i)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal */}
        <div className="overlay" style={{ display: showModal ? "block" : "none" }} onClick={closeModal}></div>
        <div className="filter-popup modal-wide" style={{ display: showModal ? "block" : "none" }}>
          <h3>{editingIndex === null ? "Add Payroll" : "Edit Payroll"}</h3>

          <label>Staff Name</label>
          <input
            type="text"
            value={modalRecord.name}
            onChange={(e) => setModalRecord({ ...modalRecord, name: e.target.value })}
          />

          <label>Position</label>
          <input
            type="text"
            value={modalRecord.position}
            onChange={(e) => setModalRecord({ ...modalRecord, position: e.target.value })}
          />

          <label>Salary</label>
          <input
            type="number"
            value={modalRecord.salary}
            onChange={(e) => setModalRecord({ ...modalRecord, salary: parseFloat(e.target.value) })}
          />

          <label>Status</label>
          <select
            value={modalRecord.status}
            onChange={(e) => setModalRecord({ ...modalRecord, status: e.target.value as any })}
          >
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>

          <label>Payment Date</label>
          <input
            type="date"
            value={modalRecord.date}
            onChange={(e) => setModalRecord({ ...modalRecord, date: e.target.value })}
          />

          <div className="filter-popup-buttons">
            <button className="add-btn" onClick={handleSave}>Save</button>
            <button className="delete-btn" onClick={closeModal}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollPage;
