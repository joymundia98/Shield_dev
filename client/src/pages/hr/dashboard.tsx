import React, { useEffect, useRef, useState } from "react";
import "../../styles/global.css";
import Chart from "chart.js/auto";
import { useNavigate } from "react-router-dom";

const HRDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Chart refs
  const deptChartRef = useRef<Chart | null>(null);
  const genderChartRef = useRef<Chart | null>(null);
  const leaveChartRef = useRef<Chart | null>(null);
  const joinLeaveChartRef = useRef<Chart | null>(null);
  const complianceChartRef = useRef<Chart | null>(null);

  // Color palette
  const blue = "#1A3D7C";
  const brown1 = "#5C4736";
  const brown2 = "#AF907A";
  const gray = "#817E7A";
  const dark = "#20262C";

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Add/remove sidebar-open class on body for proper animation
    useEffect(() => {
      const body = document.body;
      if (sidebarOpen) {
        body.classList.add("sidebar-open");
      } else {
        body.classList.remove("sidebar-open");
      }
      // Clean up on unmount
      return () => body.classList.remove("sidebar-open");
    }, [sidebarOpen]);

  useEffect(() => {
    // Destroy previous charts if they exist
    deptChartRef.current?.destroy();
    genderChartRef.current?.destroy();
    leaveChartRef.current?.destroy();
    joinLeaveChartRef.current?.destroy();
    complianceChartRef.current?.destroy();

    // Department Breakdown
    const deptCtx = document.getElementById("deptChart") as HTMLCanvasElement;
    if (deptCtx) {
      deptChartRef.current = new Chart(deptCtx, {
        type: "bar",
        data: {
          labels: [
            "Worship & Music",
            "Youth Ministry",
            "Children's Ministry",
            "Hospitality",
            "Outreach",
            "Finance/Admin",
            "Pastoral Team",
            "Maintenance",
            "IT & Media",
          ],
          datasets: [
            { label: "Staff Count", data: [12, 8, 6, 7, 6, 6, 5, 4, 4], backgroundColor: blue },
          ],
        },
        options: { responsive: true },
      });
    }

    // Gender Ratio
    const genderCtx = document.getElementById("genderChart") as HTMLCanvasElement;
    if (genderCtx) {
      genderChartRef.current = new Chart(genderCtx, {
        type: "pie",
        data: {
          labels: ["Male", "Female"],
          datasets: [{ data: [28, 30], backgroundColor: [blue, brown2] }],
        },
        options: { responsive: true },
      });
    }

    // Leave Overview
    const leaveCtx = document.getElementById("leaveChart") as HTMLCanvasElement;
    if (leaveCtx) {
      leaveChartRef.current = new Chart(leaveCtx, {
        type: "doughnut",
        data: {
          labels: ["On Leave Today", "Pending Approvals", "Next 30 Days"],
          datasets: [{ data: [3, 4, 9], backgroundColor: [blue, brown1, gray] }],
        },
        options: { responsive: true },
      });
    }

    // Joiners & Leavers
    const joinLeaveCtx = document.getElementById("joinLeaveChart") as HTMLCanvasElement;
    if (joinLeaveCtx) {
      joinLeaveChartRef.current = new Chart(joinLeaveCtx, {
        type: "bar",
        data: {
          labels: ["New Staff", "Volunteers Added", "Exits"],
          datasets: [{ label: "Count", data: [2, 3, 1], backgroundColor: [blue, brown2, dark] }],
        },
        options: { responsive: true },
      });
    }

    // Compliance & Credentials
    const complianceCtx = document.getElementById("complianceChart") as HTMLCanvasElement;
    if (complianceCtx) {
      complianceChartRef.current = new Chart(complianceCtx, {
        type: "bar",
        data: {
          labels: ["Pending Background Checks", "Expired IDs", "Credentials Expiring", "Missed Training"],
          datasets: [{ label: "Count", data: [2, 1, 3, 5], backgroundColor: [blue, gray, brown2, dark] }],
        },
        options: { responsive: true, indexAxis: "y" },
      });
    }
  }, []);

  return (
    <div className="dashboard-wrapper">
      {/* Hamburger */}
      <button className="hamburger" onClick={toggleSidebar}>
        &#9776;
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        {/* Close Button (Styled like ClassDashboard) */}
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

        <h2>HR MANAGEMENT</h2>
        <a href="/hr/dashboard" className="active">Dashboard</a>
        <a href="/hr/staff-directory">Staff Directory</a>
        <a href="/hr/pastors">Pastors & Clergy</a>
        <a href="/hr/attendance">Attendance</a>
        <a href="/hr/leave">Leave Management</a>
        <a href="/hr/departments">Departments</a>
        <a href="/hr/payroll">Payroll</a>
        <a href="#">Volunteers</a>
        <a href="#">Training</a>
        <a href="#">Documents</a>

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
          Logout
        </a>
      </div>

      {/* Main Dashboard Content */}
      <div className="dashboard-content">
        <h1>HR Dashboard Overview</h1>

        <div className="kpi-container">
          <div className="kpi-card"><h3>Total Staff</h3><p>58</p></div>
          <div className="kpi-card"><h3>Paid Staff</h3><p>35</p></div>
          <div className="kpi-card"><h3>Volunteers</h3><p>11</p></div>
          <div className="kpi-card"><h3>Departments</h3><p>9</p></div>
          <div className="kpi-card"><h3>Active Leave</h3><p>3</p></div>
          <div className="kpi-card"><h3>Expiring Docs</h3><p>6</p></div>
        </div>

        <div className="chart-grid">
          <div className="chart-box"><h3>Department Breakdown</h3><canvas id="deptChart"></canvas></div>
          <div className="chart-box"><h3>Gender Ratio</h3><canvas id="genderChart"></canvas></div>
          <div className="chart-box"><h3>Leave Management Overview</h3><canvas id="leaveChart"></canvas></div>
          <div className="chart-box"><h3>Joiners & Leavers</h3><canvas id="joinLeaveChart"></canvas></div>
          <div className="chart-box"><h3>Compliance & Credentials</h3><canvas id="complianceChart"></canvas></div>
        </div>

        <div className="chart-box" style={{ marginTop: 30 }}>
          <h3>Recent Activity</h3>
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
            <li>Updated staff: <b>Kofi Appiah</b></li>
            <li>New volunteer: <b>Sarah Owusu</b></li>
            <li>Pastoral license renewed</li>
            <li>Payroll updated (Nov)</li>
            <li>Safeguarding training completed</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
