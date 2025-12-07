import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css"; // Make sure your CSS file is included

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

const PayrollPage: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Static Payroll Data
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

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"approve" | "reject" | null>(null);
  const [modalRecord, setModalRecord] = useState<PayrollRecord | null>(null);
  const [selectedRecordIndex, setSelectedRecordIndex] = useState<number | null>(null);

  // Sidebar
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  useEffect(() => {
    if (sidebarOpen) document.body.classList.add("sidebar-open");
    else document.body.classList.remove("sidebar-open");
  }, [sidebarOpen]);

  // Filtered Payroll Data
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

  const groupedByDepartment = useMemo(() => {
    const groups: Record<string, PayrollRecord[]> = {};
    filteredPayroll.forEach((rec) => {
      if (!groups[rec.department]) groups[rec.department] = [];
      groups[rec.department].push(rec);
    });
    return groups;
  }, [filteredPayroll]);

  // KPI Calculations - Now on filtered payroll data
  const selectedMonthIndex = filterMonth === "all" ? new Date().getMonth() : monthNames.indexOf(filterMonth);
  const selectedYearValue = filterYear === "all" ? new Date().getFullYear() : filterYear;

  const payrollThisMonth = filteredPayroll.filter((p) => {
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

  // Modal Handlers
  const openModal = (action: "approve" | "reject", record: PayrollRecord, index: number) => {
    setModalAction(action);
    setModalRecord(record);
    setSelectedRecordIndex(index);
    setModalOpen(true);
  };

  const confirmModal = () => {
    if (modalAction && modalRecord && selectedRecordIndex !== null) {
      const updatedData = [...payrollData];
      updatedData[selectedRecordIndex].status = modalAction === "approve" ? "Paid" : "Overdue";
      setPayrollData(updatedData);
      closeModal();
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalAction(null);
    setSelectedRecordIndex(null);
  };

  // Open View in New Tab
  const viewDetails = (record: PayrollRecord) => {
    const url = `/payroll/details/${record.name}`;
    window.open(url, "_blank");
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <button className="hamburger" onClick={toggleSidebar}>&#9776;</button>
      <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`} id="sidebar">
        <h2>FINANCE</h2>
        <a href="/finance/dashboard">Dashboard</a>
        <a href="/finance/payroll" className="active">Payroll</a>
        <a href="/finance/financeCategory">Finance Categories</a>
        <hr className="sidebar-separator" />
        <a href="/dashboard">← Back to Main Dashboard</a>
        <a href="/" onClick={() => { localStorage.clear(); navigate("/"); }}>Logout</a>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        <h1>Payroll</h1>
        
        {/* Search Bar */}
        <div className="search-bar-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search payroll..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <br/>

        {/* Filter Dropdowns */}
        <div className="filters">
          <label>Month:
            <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
              <option value="all">All</option>
              {monthNames.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </label>&emsp;
          <label>Year:
            <select value={filterYear} onChange={(e) => setFilterYear(e.target.value === "all" ? "all" : parseInt(e.target.value))}>
              <option value="all">All</option>
              {[2020, 2021, 2022, 2023, 2024, 2025].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </label>&emsp;
          <label>Department:
            <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
              <option value="all">All</option>
              {["Finance", "Logistics", "Transport"].map((dep) => (
                <option key={dep} value={dep}>{dep}</option>
              ))}
            </select>
          </label>
        </div>
        <br/>

        {/* KPI Cards */}
        <div className="kpi-container">
          <div className="kpi-card">
            <h3>Total Paid (This Month)</h3>
            <p>${kpiTotalPaid.toLocaleString()}</p>
          </div>
          <div className="kpi-card">
            <h3>Total Due (This Month)</h3>
            <p>${kpiTotalDue.toLocaleString()}</p>
          </div>
          <div className="kpi-card">
            <h3>Employees Paid</h3>
            <p>{kpiPaidCount}</p>
          </div>
          <div className="kpi-card">
            <h3>Employees Unpaid</h3>
            <p>{kpiUnpaidCount}</p>
          </div>
        </div>

        {/* Payroll Table */}
        {Object.entries(groupedByDepartment).map(([department, records]) => (
          <div key={department} style={{ marginTop: "20px" }}>
            <h2>{department} Department</h2>
            <table className="responsive-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Position</th>
                  <th>Salary</th>
                  <th>Status</th>
                  <th>Payment Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record, index) => (
                  <tr key={index}>
                    <td>{record.name}</td>
                    <td>{record.position}</td>
                    <td>${record.salary.toLocaleString()}</td>
                    <td><span className={`status ${record.status.toLowerCase()}`}>{record.status}</span></td>
                    <td>{record.date}</td>
                    <td>
                      <button className="view-btn" onClick={() => viewDetails(record)}>
                        View
                      </button>&emsp;
                      {record.status !== "Paid" && (
                        <>
                          <button className="approve-btn" onClick={() => openModal("approve", record, index)}>
                            Approve
                          </button>&emsp;
                          <button className="reject-btn" onClick={() => openModal("reject", record, index)}>
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        {/* Confirmation Modal */}
        {modalOpen && (
          <div className="expenseModal" style={{ display: "flex" }}>
            <div className="expenseModal-content">
              <h2>{modalAction === "approve" ? "Approve Payroll?" : "Reject Payroll?"}</h2>
              <p>Are you sure you want to {modalAction === "approve" ? "approve" : "reject"} the payroll for {modalRecord?.name}?</p>
              <div className="expenseModal-buttons">
                <button className="expenseModal-cancel" onClick={closeModal}>Cancel</button>
                <button className="expenseModal-confirm" onClick={confirmModal}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayrollPage;
