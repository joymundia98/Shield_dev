import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

const ChurchMembersDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const growthChartRef = useRef<Chart | null>(null);
  const genderChartRef = useRef<Chart | null>(null);
  const ageChartRef = useRef<Chart | null>(null);
  const statusChartRef = useRef<Chart | null>(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Match sidebar logic from AttendancePage
  useEffect(() => {
    if (sidebarOpen) document.body.classList.add("sidebar-open");
    else document.body.classList.remove("sidebar-open");

    return () => document.body.classList.remove("sidebar-open");
  }, [sidebarOpen]);

  // Initialize charts
  useEffect(() => {
    growthChartRef.current?.destroy();
    genderChartRef.current?.destroy();
    ageChartRef.current?.destroy();
    statusChartRef.current?.destroy();

    const growthCtx = document.getElementById("growthChart") as HTMLCanvasElement;
    if (growthCtx) {
      growthChartRef.current = new Chart(growthCtx, {
        type: "line",
        data: {
          labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
          datasets: [{
            label: "Total Members",
            data: [260,270,275,280,290,300,305,310,315,318,319,320],
            borderColor: "#1A3D7C",
            backgroundColor: "rgba(26,61,124,0.25)",
            borderWidth: 3,
            fill: true,
            tension: 0.3
          }]
        },
        options: { responsive: true }
      });
    }

    const genderCtx = document.getElementById("genderChart") as HTMLCanvasElement;
    if (genderCtx) {
      genderChartRef.current = new Chart(genderCtx, {
        type: "doughnut",
        data: {
          labels: ["Male","Female"],
          datasets: [{ data: [180,140], backgroundColor: ["#1A3D7C","#AF907A"] }]
        },
        options: { responsive: true }
      });
    }

    const ageCtx = document.getElementById("ageChart") as HTMLCanvasElement;
    if (ageCtx) {
      ageChartRef.current = new Chart(ageCtx, {
        type: "doughnut",
        data: {
          labels: ["0-12","13-18","19-35","36-60","60+"],
          datasets: [{ data: [50,40,120,80,30], backgroundColor: ["#5C4736","#817E7A","#AF907A","#1A3D7C","#20262C"] }]
        },
        options: { responsive: true }
      });
    }

    const statusCtx = document.getElementById("statusChart") as HTMLCanvasElement;
    if (statusCtx) {
      statusChartRef.current = new Chart(statusCtx, {
        type: "pie",
        data: {
          labels: ["Active","Visitor","New Convert","Inactive","Transferred"],
          datasets: [{ data: [200,45,30,30,15], backgroundColor: ["#1A3D7C","#5C4736","#AF907A","#817E7A","#20262C"] }]
        },
        options: { responsive: true }
      });
    }
  }, []);

  return (
    <div className="dashboard-wrapper members-wrapper">
      {/* HAMBURGER */}
      <button className="hamburger" onClick={toggleSidebar}>
        &#9776;
      </button>

      {/* SIDEBAR */}
      <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="close-wrapper">
          <div className="toggle close-btn">
            <input type="checkbox" checked={sidebarOpen} onChange={toggleSidebar} />
            <span className="button"></span>
            <span className="label">X</span>
          </div>
        </div>

        <h2>CONGREGATION</h2>
        <a href="/congregation/dashboard">Dashboard</a>
        <a href="/congregation/members" className="active">Members</a>
        <a href="/congregation/attendance">Attendance</a>
        <a href="/congregation/followups">Follow-ups</a>
        <a href="/congregation/visitors">Visitors</a>
        <a href="/congregation/converts">New Converts</a>

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

      {/* MAIN CONTENT */}
      <div className="dashboard-content">
        <header>
          <h1>Church Members Overview</h1>
          <br/>
          <div className="header-buttons">
            <button className="add-btn" onClick={() => navigate("/congregation/add-member")}>
              + &nbsp; Add Member
            </button>&nbsp;&nbsp;
            <button className="add-btn" onClick={() => navigate("/congregation/members")}>
              View Members
            </button>
          </div>
        </header>

        {/* KPI CARDS */}
        <br/><br/>
        <div className="kpi-container">
          <div className="kpi-card"><h3>Total Members</h3><p>320</p></div>
          <div className="kpi-card"><h3>Widows</h3><p>25</p></div>
          <div className="kpi-card"><h3>Orphans</h3><p>15</p></div>
          <div className="kpi-card"><h3>Disabled Members</h3><p>10</p></div>
        </div>

        {/* CHART GRID */}
        <div className="chart-grid">
          <div className="chart-box">
            <h3>Church Growth (12 Months)</h3>
            <canvas id="growthChart"></canvas>
          </div>
          <div className="chart-box">
            <h3>Gender Distribution</h3>
            <canvas id="genderChart"></canvas>
          </div>
          <div className="chart-box">
            <h3>Age Group Distribution</h3>
            <canvas id="ageChart"></canvas>
          </div>
          <div className="chart-box">
            <h3>Members by Status</h3>
            <canvas id="statusChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChurchMembersDashboard;
