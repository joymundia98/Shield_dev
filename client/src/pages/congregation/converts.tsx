import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

const ConvertsDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Chart references (Chart.js instances)
  const growthChartRef = useRef<Chart | null>(null);
  const genderChartRef = useRef<Chart | null>(null);
  const ageChartRef = useRef<Chart | null>(null);

  /* ---------------- SIDEBAR LOGIC ---------------- */
  useEffect(() => {
    if (sidebarOpen) document.body.classList.add("sidebar-open");
    else document.body.classList.remove("sidebar-open");

    return () => document.body.classList.remove("sidebar-open");
  }, [sidebarOpen]);

  /* ---------------- INITIALIZE CHARTS ---------------- */
  useEffect(() => {
    // Destroy existing charts if they exist
    growthChartRef.current?.destroy();
    genderChartRef.current?.destroy();
    ageChartRef.current?.destroy();

    /* --- Converts Growth Chart --- */
    const growthCtx = document.getElementById("convertGrowthChart") as HTMLCanvasElement;
    if (growthCtx) {
      growthChartRef.current = new Chart(growthCtx, {
        type: "line",
        data: {
          labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
          datasets: [
            {
              label: "New Converts",
              data: [2,3,1,4,3,5,2,3,1,2,4,5],
              borderColor: "#1A3D7C",
              backgroundColor: "rgba(26,61,124,0.25)",
              borderWidth: 3,
              fill: true,
              tension: 0.3,
            }
          ]
        },
        options: { responsive: true }
      });
    }

    /* --- Gender Distribution Chart --- */
    const genderCtx = document.getElementById("convertGenderChart") as HTMLCanvasElement;
    if (genderCtx) {
      genderChartRef.current = new Chart(genderCtx, {
        type: "doughnut",
        data: {
          labels: ["Male", "Female"],
          datasets: [
            {
              data: [15, 15],
              backgroundColor: ["#1A3D7C", "#AF907A"],
            }
          ]
        },
        options: { responsive: true }
      });
    }

    /* --- Age Group Chart --- */
    const ageCtx = document.getElementById("convertAgeChart") as HTMLCanvasElement;
    if (ageCtx) {
      ageChartRef.current = new Chart(ageCtx, {
        type: "doughnut",
        data: {
          labels: ["0-12", "13-18", "19-35", "36-60", "60+"],
          datasets: [
            {
              data: [2, 3, 15, 8, 2],
              backgroundColor: [
                "#5C4736",
                "#817E7A",
                "#AF907A",
                "#1A3D7C",
                "#20262C",
              ],
            }
          ]
        },
        options: { responsive: true }
      });
    }
  }, []);

  return (
    <div className="dashboard-wrapper converts-wrapper">
      
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

        <h2>CONVERTS</h2>
        <a href="/congregation/converts" className="active">Dashboard</a>
        <a href="/congregation/convertRecords">All Converts</a>
        <a href="/congregation/convertReports">Reports</a>
        <a href="/congregation/convertSettings">Settings</a>

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
        
        {/* HEADER */}
        <header>
          <h1>New Converts Overview</h1>
          <br/>
          <div className="header-buttons">
            <button className="add-btn" onClick={() => navigate("/congregation/addConvert")}>
              + &nbsp; Add Convert
            </button>
            &nbsp;&nbsp;
            <button className="add-btn" onClick={() => navigate("/congregation/convertRecords")}>
              View Converts
            </button>
          </div>
        </header>

        <br/><br/>

        {/* KPI CARDS */}
        <div className="kpi-container">
          <div className="kpi-card"><h3>Total Converts</h3><p>30</p></div>
          <div className="kpi-card"><h3>New This Month</h3><p>5</p></div>
        </div>

        {/* CHART GRID */}
        <div className="chart-grid">
          
          <div className="chart-box">
            <h3>Converts Growth (12 Months)</h3>
            <canvas id="convertGrowthChart"></canvas>
          </div>

          <div className="chart-box">
            <h3>Gender Distribution</h3>
            <canvas id="convertGenderChart"></canvas>
          </div>

          <div className="chart-box">
            <h3>Age Group Distribution</h3>
            <canvas id="convertAgeChart"></canvas>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ConvertsDashboard;
