import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

interface Leave {
  name: string;
  dept: string;
  type: string;
  start: string;
  end: string;
  days: number;
  status: "pending" | "approved" | "rejected";
}

const LeaveManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [leaves, setLeaves] = useState<Leave[]>([
    { name: "James Carter", dept: "Finance", type: "Annual Leave", start: "2025-02-12", end: "2025-02-15", days: 4, status: "pending" },
    { name: "Diana Hope", dept: "IT Department", type: "Sick Leave", start: "2025-03-03", end: "2025-03-03", days: 1, status: "approved" },
  ]);

  /* ---------------- SIDEBAR ---------------- */
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  useEffect(() => {
    if (sidebarOpen) document.body.classList.add("sidebar-open");
    else document.body.classList.remove("sidebar-open");
  }, [sidebarOpen]);

  /* ---------------- KPI ---------------- */
  const totalRequests = leaves.length;
  const approvedCount = leaves.filter(l => l.status === "approved").length;
  const pendingCount = leaves.filter(l => l.status === "pending").length;
  const rejectedCount = leaves.filter(l => l.status === "rejected").length;

  /* ---------------- SEARCH FILTER ---------------- */
  const filteredLeaves = useMemo(() => {
    const lower = search.toLowerCase();
    return leaves.filter(l =>
      l.name.toLowerCase().includes(lower) ||
      l.dept.toLowerCase().includes(lower) ||
      l.type.toLowerCase().includes(lower)
    );
  }, [leaves, search]);

  /* ---------------- HANDLERS ---------------- */
  const handleStatusChange = (index: number, status: Leave["status"]) => {
    setLeaves(prev => {
      const updated = [...prev];
      updated[index].status = status;
      return updated;
    });
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

        <h2>HR MANAGER</h2>
        <a href="/dashboard">Dashboard</a>
        <a href="/staff-directory">Staff Directory</a>
        <a href="/attendance">Attendance</a>
        <a href="/leave-management" className="active">Leave Management</a>
        <a href="#">Volunteers</a>
        <a href="#">Training</a>
        <a href="#">HR Documents</a>

        <hr className="sidebar-separator" />
        <a href="/dashboard" className="return-main">← Back to Main Dashboard</a>
        <a href="/" className="logout-link" onClick={e => { e.preventDefault(); localStorage.clear(); navigate("/"); }}>
          ➜] Logout
        </a>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        <h1>Leave Management</h1>

        {/* Search */}
        <div className="table-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <input
            type="text"
            className="search-input"
            placeholder="Search leave requests..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* KPI Cards */}
        <div className="kpi-container">
          <div className="kpi-card"><h3>Total Requests</h3><p>{totalRequests}</p></div>
          <div className="kpi-card"><h3>Approved</h3><p>{approvedCount}</p></div>
          <div className="kpi-card"><h3>Pending</h3><p>{pendingCount}</p></div>
          <div className="kpi-card"><h3>Rejected</h3><p>{rejectedCount}</p></div>
        </div>

        {/* Leave Table */}
        <div id="leaveTableWrapper">
          <table className="responsive-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Leave Type</th>
                <th>Date</th>
                <th>Days</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map((leave, i) => (
                <tr key={i}>
                  <td>{leave.name}</td>
                  <td>{leave.dept}</td>
                  <td>{leave.type}</td>
                  <td>{leave.start} → {leave.end}</td>
                  <td>{leave.days}</td>
                  <td><span className={`status ${leave.status}`}>{leave.status}</span></td>
                  <td className="actions">
                    {leave.status !== "approved" && <button className="icon-approve" onClick={() => handleStatusChange(i, "approved")}>✔</button>}
                    {leave.status !== "rejected" && <button className="icon-reject" onClick={() => handleStatusChange(i, "rejected")}>✖</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveManagementPage;
