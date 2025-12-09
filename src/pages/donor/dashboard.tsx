import React, { useEffect, useMemo, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

const DonorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const donationTypeChartRef = useRef<Chart | null>(null);
  const monthlyDonationChartRef = useRef<Chart | null>(null);

  // Sample Dynamic Data (replace with API later)
  const donors = useMemo(
    () => [
      { name: "Acme Corp.", amount: 15000 },
      { name: "John Doe", amount: 8500 },
      { name: "Sarah Smith", amount: 7200 },
      { name: "Unity Group", amount: 5000 },
    ],
    []
  );

  const donationTypes = useMemo(
    () => [
      { type: "Tithes", amount: 20000 },
      { type: "Offering", amount: 15000 },
      { type: "Special Fund", amount: 8000 },
      { type: "Event", amount: 2500 },
    ],
    []
  );

  const monthlyDonations = useMemo(
    () => [5000, 4500, 7000, 6000, 8500, 7000],
    []
  );

  // KPI Calculations
  const totalDonors = donors.length + 100; // 120 in original
  const totalDonationAmount = donationTypes.reduce(
    (sum, d) => sum + d.amount,
    0
  );
  const activeDonors = 85; // matches original HTML
  const topDonor = donors.reduce((prev, curr) =>
    prev.amount > curr.amount ? prev : curr
  ).name;

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

  /* ------------------------------------
       Render Charts
  ---------------------------------------*/
  useEffect(() => {
    // Destroy old charts if they exist
    donationTypeChartRef.current?.destroy();
    monthlyDonationChartRef.current?.destroy();

    // Donations by Type
    const typeCanvas = document.getElementById(
      "donationTypeChart"
    ) as HTMLCanvasElement;

    if (typeCanvas) {
      donationTypeChartRef.current = new Chart(typeCanvas, {
        type: "doughnut",
        data: {
          labels: donationTypes.map((d) => d.type),
          datasets: [
            {
              data: donationTypes.map((d) => d.amount),
              backgroundColor: ["#1A3D7C", "#5C4736", "#AF907A", "#20262C"],
              borderWidth: 0,
            },
          ],
        },
        options: {
          plugins: { legend: { position: "bottom" } },
        },
      });
    }

    // Monthly Donations
    const monthlyCanvas = document.getElementById(
      "monthlyDonationsChart"
    ) as HTMLCanvasElement;

    if (monthlyCanvas) {
      monthlyDonationChartRef.current = new Chart(monthlyCanvas, {
        type: "bar",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            {
              label: "Donations ($)",
              data: monthlyDonations,
              backgroundColor: "#1A3D7C",
              borderRadius: 5,
            },
          ],
        },
        options: {
          scales: { y: { beginAtZero: true } },
          plugins: { legend: { display: false } },
        },
      });
    }
  }, [donationTypes, monthlyDonations]);

  return (
    <div className="dashboard-wrapper">
      {/* Hamburger */}
      <button className="hamburger" onClick={toggleSidebar}>
        &#9776;
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`} id="sidebar">
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

        <h2>DONOR MGMT</h2>

        <a href="/donor/dashboard" className="active">
          Dashboard
        </a>
        <a href="/donor/donors">Donors List</a>
        <a href="/donor/donations">Donations</a>
        <a href="/donor/donorCategories">Donor Categories</a>

        <hr className="sidebar-separator" />
        <a href="/dashboard" className="return-main">
          ← Back to Main Dashboard
        </a>

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
        <h1>Donor Dashboard Overview</h1>

        <br/><br/>

        <div className="kpi-container">
          <div className="kpi-card">
            <h3>Total Donors</h3>
            <p>{totalDonors}</p>
          </div>

          <div className="kpi-card">
            <h3>Total Donations</h3>
            <p>${totalDonationAmount.toLocaleString()}</p>
          </div>

          <div className="kpi-card">
            <h3>Active Donors</h3>
            <p>{activeDonors}</p>
          </div>

          <div className="kpi-card">
            <h3>Top Donor</h3>
            <p>{topDonor}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="chart-grid">
          <div className="chart-box">
            <h3>Donations by Type</h3>
            <canvas id="donationTypeChart"></canvas>
          </div>

          <div className="chart-box">
            <h3>Monthly Donations</h3>
            <canvas id="monthlyDonationsChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
