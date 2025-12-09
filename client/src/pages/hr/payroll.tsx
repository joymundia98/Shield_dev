import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

interface PayrollRecord {
  name: string;
  position: string;
  salary: number;
  status: "Paid" | "Pending" | "Overdue";
  date: string;
  department: string;
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const HrPayrollPage: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ------------------- Payroll Data -------------------
  const [payrollData, setPayrollData] = useState<PayrollRecord[]>([
    { name: "John Doe", position: "Pastor", salary: 1500, status: "Paid", date: "2025-11-10", department: "Finance" },
    { name: "Mary Smith", position: "Secretary", salary: 800, status: "Pending", date: "2025-11-15", department: "Finance" },
    { name: "James Wilson", position: "Choir Director", salary: 600, status: "Paid", date: "2025-11-10", department: "Logistics" },
    { name: "Anna Brown", position: "Driver", salary: 700, status: "Overdue", date: "2025-11-12", department: "Transport" },
  ]);

  const [search, setSearch] = useState("");
  const [filterMonth, setFilterMonth] = useState<string | "all">("all");
  const [filterYear, setFilterYear] = useState<number | "all">("all");
  const [filterDepartment, setFilterDepartment] = useState<string | "all">("all");

  // ------------------- Sidebar -------------------
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  useEffect(() => {
    if (sidebarOpen) document.body.classList.add("sidebar-open");
    else document.body.classList.remove("sidebar-open");
  }, [sidebarOpen]);

  // ------------------- Filtered Payroll -------------------
  const filteredPayroll = useMemo(() => {
    return payrollData.filter((rec) => {
      const dateObj = new Date(rec.date);
      if (filterMonth !== "all" && monthNames[dateObj.getMonth()] !== filterMonth) return false;
      if (filterYear !== "all" && dateObj.getFullYear() !== filterYear) return false;
      if (filterDepartment !== "all" && rec.department !== filterDepartment) return false;
      if (search && !JSON.stringify(rec).toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [payrollData, filterMonth, filterYear, filterDepartment, search]);

  // ------------------- Group by Department -------------------
  const groupedByDepartment = useMemo(() => {
    const groups: Record<string, PayrollRecord[]> = {};
    filteredPayroll.forEach((rec) => {
      if (!groups[rec.department]) groups[rec.department] = [];
      groups[rec.department].push(rec);
    });
    return groups;
  }, [filteredPayroll]);

  // ------------------- KPI Calculations -------------------
  const selectedMonthIndex = filterMonth === "all" ? new Date().getMonth() : monthNames.indexOf(filterMonth);
  const selectedYearValue = filterYear === "all" ? new Date().getFullYear() : filterYear;

  const payrollThisMonth = payrollData.filter((p) => {
    const d = new Date(p.date);
    return d.getMonth() === selectedMonthIndex && d.getFullYear() === selectedYearValue;
  });

  const kpiTotalPaid = payrollThisMonth
    .filter((p) => p.status === "Paid")
    .reduce((sum, p) => sum + p.salary, 0);

  const kpiTotalDue = payrollThisMonth
    .filter((p) => p.status !== "Paid")
    .reduce((sum, p) => sum + p.salary, 0);

  const kpiPaidCount = payrollThisMonth.filter((p) => p.status === "Paid").length;
  const kpiUnpaidCount = payrollThisMonth.filter((p) => p.status !== "Paid").length;

  // ------------------- Navigation Handlers -------------------
  const openAddPayroll = () => {
    navigate("/hr/addPayroll");
  };

  const openEditPayroll = (index: number) => {
    navigate("/hr/addPayroll", { state: { editingIndex: index, payrollRecord: payrollData[index] } });
  };

  const openViewPayroll = (index: number) => {
    navigate("/hr/viewPayroll", { state: payrollData[index] });
  };

  const deletePayroll = (index: number, department: string) => {
    // Find the correct payroll record index in the ungrouped payrollData
    const originalIndex = payrollData.findIndex(record => record.name === groupedByDepartment[department][index].name);

    // Ask for user confirmation
    const confirmed = window.confirm("Are you sure you want to delete this payroll record?");
    if (confirmed) {
      // Proceed with deletion
      const updatedData = payrollData.filter((_, i) => i !== originalIndex);
      setPayrollData(updatedData); // Update the state with the new data
    }
  };


  return (
    <div className="dashboard-wrapper">
      {/* Hamburger */}
      <button className="hamburger" onClick={toggleSidebar}>&#9776;</button>

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

        <h2>HR MANAGER</h2>
        <a href="/hr/dashboard">Dashboard</a>
        <a href="/hr/staffDirectory">Staff Directory</a>
        <a href="/hr/payroll" className="active">Payroll</a>
        <a href="/hr/leave">Leave Management</a>
        <a href="/hr/leaveApplications">Leave Applications</a>
        <a href="/hr/departments">Departments</a>

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
          ➜ Logout
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
          <button className="add-btn" onClick={openAddPayroll}>+ Add Payroll Record</button>
        </div>

        {/* Filters */}
        <br />
        <div className="filters" style={{ margin: "10px 0", display: "flex", gap: "10px" }}>
          <label>
            Month:
            <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
              <option value="all">All</option>
              {monthNames.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </label>
          <label>
            Year:
            <select value={filterYear} onChange={(e) => setFilterYear(e.target.value === "all" ? "all" : parseInt(e.target.value))}>
              <option value="all">All</option>
              {[2020, 2021, 2022, 2023, 2024, 2025].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </label>
          <label>
            Department:
            <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
              <option value="all">All</option>
              {Array.from(new Set(payrollData.map(p => p.department))).map(dep => (
                <option key={dep} value={dep}>{dep}</option>
              ))}
            </select>
          </label>
        </div>

        {/* KPI Cards */}
        <br />
        <div className="kpi-container" id="kpiContainer">
          <div className="kpi-card">
            <h3>Total Paid (This Month)</h3>
            <p id="kpiTotalPaid">${kpiTotalPaid.toLocaleString()}</p>
          </div>
          <div className="kpi-card">
            <h3>Total Due (This Month)</h3>
            <p id="kpiTotalDue">${kpiTotalDue.toLocaleString()}</p>
          </div>
          <div className="kpi-card">
            <h3>Employees Paid</h3>
            <p id="kpiPaidCount">{kpiPaidCount}</p>
          </div>
          <div className="kpi-card">
            <h3>Employees Unpaid</h3>
            <p id="kpiUnpaidCount">{kpiUnpaidCount}</p>
          </div>
        </div>

        {/* Payroll Table Grouped by Department */}
        {Object.entries(groupedByDepartment).map(([dept, records]) => (
          <div key={dept} style={{ marginTop: "20px" }}>
            <h2>{dept} Department</h2>
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
                {records.map((p, i) => (
                  <tr key={i}>
                    <td>{p.name}</td>
                    <td>{p.position}</td>
                    <td>${p.salary.toLocaleString()}</td>
                    <td><span className={`status ${p.status.toLowerCase()}`}>{p.status}</span></td>
                    <td>{p.date}</td>
                    <td>
                      <button className="add-btn" onClick={() => openViewPayroll(i)}>View</button>&emsp;
                      <button className="edit-btn" onClick={() => openEditPayroll(i)}>Edit</button>&emsp;
                      <button className="delete-btn" onClick={() => deletePayroll(i, dept)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HrPayrollPage;
