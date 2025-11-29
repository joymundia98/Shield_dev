import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "../../styles/global.css";

interface IncomeEntry {
  category: string;
  giver: string;
  amount: number;
  status: "Approved" | "Pending" | "Rejected";
}

const sampleIncomeData: IncomeEntry[] = [
  { category: "Tithes", giver: "John Doe", amount: 200, status: "Approved" },
  { category: "Special Offerings", giver: "Mary Jane", amount: 500, status: "Pending" },
  { category: "Event-Based Income", giver: "Conference", amount: 1000, status: "Approved" },
  { category: "Donations", giver: "Anonymous", amount: 300, status: "Rejected" },
];

const IncomeDashboard: React.FC = () => {
  const categoryChartRef = useRef<HTMLCanvasElement>(null);
  const sourceChartRef = useRef<HTMLCanvasElement>(null);

  // Calculate KPIs
  const totalApproved = sampleIncomeData
    .filter(i => i.status === "Approved")
    .reduce((sum, i) => sum + i.amount, 0);
  const totalPending = sampleIncomeData
    .filter(i => i.status === "Pending")
    .reduce((sum, i) => sum + i.amount, 0);
  const totalRejected = sampleIncomeData
    .filter(i => i.status === "Rejected")
    .reduce((sum, i) => sum + i.amount, 0);

  // Prepare chart data
  const categoryTotals: Record<string, number> = {};
  const sourceTotals: Record<string, number> = {};
  sampleIncomeData.forEach(i => {
    categoryTotals[i.category] = (categoryTotals[i.category] || 0) + i.amount;
    sourceTotals[i.giver] = (sourceTotals[i.giver] || 0) + i.amount;
  });

  useEffect(() => {
    if (categoryChartRef.current) {
      new Chart(categoryChartRef.current, {
        type: "bar",
        data: {
          labels: Object.keys(categoryTotals),
          datasets: [
            { label: "Income", data: Object.values(categoryTotals), backgroundColor: "#1A3D7C" }
          ]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } }
        }
      });
    }

    if (sourceChartRef.current) {
      new Chart(sourceChartRef.current, {
        type: "pie",
        data: {
          labels: Object.keys(sourceTotals),
          datasets: [
            {
              data: Object.values(sourceTotals),
              backgroundColor: ["#5C4736", "#817E7A", "#AF907A", "#20262C", "#858796"]
            }
          ]
        },
        options: { responsive: true }
      });
    }
  }, []);

  return (
    <div className="container">
      <header>
        <h1>Income Dashboard</h1>
        <button className="add-btn" onClick={() => window.location.href = "/income/incometracker"}>
          ← Back to Income Tracker
        </button>
        <button className="hamburger" onClick={() => {/* Implement sidebar toggle if needed */}}>&#9776;</button>
      </header>

      <div className="kpi-container">
        <div className="kpi-card">
          <h3>Total Approved Income</h3>
          <p>${totalApproved.toLocaleString()}</p>
        </div>
        <div className="kpi-card">
          <h3>Pending Income</h3>
          <p>${totalPending.toLocaleString()}</p>
        </div>
        <div className="kpi-card">
          <h3>Rejected Income</h3>
          <p>${totalRejected.toLocaleString()}</p>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-box">
          <h3>Income by Category</h3>
          <canvas ref={categoryChartRef}></canvas>
        </div>
        <div className="chart-box">
          <h3>Income by Source</h3>
          <canvas ref={sourceChartRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default IncomeDashboard;
