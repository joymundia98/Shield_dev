import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import "../../styles/global.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type AttendanceStatus = "Present" | "Absent";
type Gender = "Male" | "Female";

interface AttendanceRecord {
  date: string;
  name: string;
  gender: Gender;
  status: AttendanceStatus;
}

interface AttendanceData {
  [category: string]: AttendanceRecord[];
}

const AttendancePage: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    if (sidebarOpen) document.body.classList.add("sidebar-open");
    else document.body.classList.remove("sidebar-open");

    return () => document.body.classList.remove("sidebar-open");
  }, [sidebarOpen]);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [kpiMode, setKpiMode] = useState<"sum" | "average">("sum");

  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({});
  const toggleExpand = (category: string) => {
    setExpandedTables((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // ------------------------------------------
  // STATIC DATA
  // ------------------------------------------
  const attendanceData: AttendanceData = useMemo(
    () => ({
      Children: [
        { date: "2025-11-01", name: "Tommy", gender: "Male", status: "Present" },
        { date: "2025-11-01", name: "Lucy", gender: "Female", status: "Absent" },
        { date: "2025-11-08", name: "Tommy", gender: "Male", status: "Present" },
        { date: "2025-11-08", name: "Lucy", gender: "Female", status: "Present" },
        { date: "2025-11-15", name: "Anna", gender: "Female", status: "Present" },
        { date: "2025-11-15", name: "Sam", gender: "Male", status: "Present" },
      ],
      Adults: [
        { date: "2025-11-01", name: "John Doe", gender: "Male", status: "Present" },
        { date: "2025-11-01", name: "Mary Smith", gender: "Female", status: "Present" },
        { date: "2025-11-08", name: "John Doe", gender: "Male", status: "Absent" },
        { date: "2025-11-08", name: "Mary Smith", gender: "Female", status: "Present" },
        { date: "2025-11-15", name: "Alice", gender: "Female", status: "Present" },
        { date: "2025-11-15", name: "Bob", gender: "Male", status: "Present" },
      ],
    }),
    []
  );

  // FILTERED DATA
  const filteredRecords = useMemo(() => {
    let allRecords: AttendanceRecord[] = [];

    Object.entries(attendanceData).forEach(([category, records]) => {
      if (selectedCategory !== "All" && selectedCategory !== category) return;

      const filtered = records.filter((r) => {
        const d = new Date(r.date);
        const monthCheck = selectedMonth === "All" || d.getMonth().toString() === selectedMonth;
        const yearCheck = selectedYear === "All" || d.getFullYear().toString() === selectedYear;
        return monthCheck && yearCheck;
      });

      allRecords = allRecords.concat(filtered);
    });

    return allRecords;
  }, [attendanceData, selectedCategory, selectedMonth, selectedYear]);

  // KPI CALCULATIONS
  const calcSum = (records: AttendanceRecord[]) =>
    records.filter((r) => r.status === "Present").length;

  const calcAverage = (records: AttendanceRecord[]) => {
    const grouped: Record<string, number> = {};

    records.forEach((r) => {
      if (!grouped[r.date]) grouped[r.date] = 0;
      if (r.status === "Present") grouped[r.date]++;
    });

    const dates = Object.keys(grouped);
    if (dates.length === 0) return 0;

    return dates.reduce((sum, d) => sum + grouped[d], 0) / dates.length;
  };

  const overallKPI = kpiMode === "sum"
    ? calcSum(filteredRecords)
    : Math.round(calcAverage(filteredRecords));

  const femaleKPI = kpiMode === "sum"
    ? calcSum(filteredRecords.filter((r) => r.gender === "Female"))
    : Math.round(calcAverage(filteredRecords.filter((r) => r.gender === "Female")));

  const maleKPI = kpiMode === "sum"
    ? calcSum(filteredRecords.filter((r) => r.gender === "Male"))
    : Math.round(calcAverage(filteredRecords.filter((r) => r.gender === "Male")));

  // WEEKLY CHARTS
  const weeklyData = useMemo(() => {
    const weeks = [0, 0, 0, 0];
    const maleWeeks = [0, 0, 0, 0];
    const femaleWeeks = [0, 0, 0, 0];

    filteredRecords.forEach((r) => {
      const week = Math.min(Math.floor((new Date(r.date).getDate() - 1) / 7), 3);
      if (r.status === "Present") weeks[week]++;
      if (r.gender === "Male" && r.status === "Present") maleWeeks[week]++;
      if (r.gender === "Female" && r.status === "Present") femaleWeeks[week]++;
    });

    return { weeks, maleWeeks, femaleWeeks };
  }, [filteredRecords]);

  return (
    <div className="dashboard-wrapper">

      {/* HAMBURGER */}
      <button className="hamburger" onClick={toggleSidebar}>
        &#9776;
      </button>

      {/* SIDEBAR */}
      <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`} id="sidebar">
        <div className="close-wrapper">
          <div className="toggle close-btn">
            <input type="checkbox" checked={sidebarOpen} onChange={toggleSidebar} />
            <span className="button"></span>
            <span className="label">X</span>
          </div>
        </div>

        <h2>CONGREGATION</h2>
        <a href="/congregation/dashboard">Dashboard</a>
        <a href="/congregation/members">Members</a>
        <a href="/congregation/attendance" className="active">Attendance</a>
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

        <header className="page-header attendance-header">
          <h1>Attendance Tracker</h1>
          <button
            className="add-btn"
            style={{ margin: "10px 0" }}
            onClick={() => navigate("/attendance/record")}
          >
            Record Attendance
          </button>
        </header>

        <br /><br />

        {/* KPI CARDS */}
        <div className="kpi-container">
          <div className="kpi-card">
            <h3>Overall Attendance</h3>
            <p>{overallKPI} Congregants</p>
          </div>
          <div className="kpi-card">
            <h3>Female Attendance</h3>
            <p>{femaleKPI} Congregants</p>
          </div>
          <div className="kpi-card">
            <h3>Male Attendance</h3>
            <p>{maleKPI} Congregants</p>
          </div>
        </div>

        {/* FILTERS */}
        <div className="attendance-filter-box">
          <h3>Filter Attendance</h3>

          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="Children">Children</option>
            <option value="Adults">Adults</option>
          </select>

          &nbsp; &nbsp;

          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            <option value="All">All Months</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>

          &nbsp; &nbsp;

          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            <option value="All">All Years</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
          </select>

          <br /><br />

          <div className="radio-container">
            <label>
              <input
                type="radio"
                name="kpiMode"
                value="sum"
                checked={kpiMode === "sum"}
                onChange={() => setKpiMode("sum")}
              />
              Sum
            </label>

            <label>
              <input
                type="radio"
                name="kpiMode"
                value="average"
                checked={kpiMode === "average"}
                onChange={() => setKpiMode("average")}
              />
              Average
            </label>
          </div>
        </div>

        {/* WEEKLY CHARTS */}
        <div className="chart-grid">
          <div className="chart-box">
            <h3>Weekly Overall Attendance</h3>
            <Line
              data={{
                labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
                datasets: [
                  {
                    label: "Present Congregants",
                    data: weeklyData.weeks,
                    borderColor: "#2980b9",
                    backgroundColor: "rgba(41,128,185,0.2)",
                    fill: true,
                    tension: 0.3,
                  },
                ],
              }}
              options={{ responsive: true }}
            />
          </div>

          <div className="chart-box">
            <h3>Weekly Attendance by Gender</h3>
            <Bar
              data={{
                labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
                datasets: [
                  { label: "Male", data: weeklyData.maleWeeks, backgroundColor: "#20262C" },
                  { label: "Female", data: weeklyData.femaleWeeks, backgroundColor: "#AF907A" },
                ],
              }}
              options={{ responsive: true }}
            />
          </div>
        </div>

        {/* TABLES */}
        <h2 className="records-heading">Records</h2>

        {["Children", "Adults"].map((cat) => {
          const visibleRecords = attendanceData[cat].filter((r) => {
            const d = new Date(r.date);
            const monthCheck =
              selectedMonth === "All" || d.getMonth().toString() === selectedMonth;
            const yearCheck =
              selectedYear === "All" || d.getFullYear().toString() === selectedYear;
            return monthCheck && yearCheck;
          });

          if (selectedCategory !== "All" && selectedCategory !== cat) return null;

          return (
            <div key={cat}>
                <br/><br/>
              <h3>{cat}</h3>

              <table className="responsive-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {visibleRecords.map((r, idx) => {
                    const hidden = !expandedTables[cat] && idx > 2;

                    return (
                      <tr key={idx} style={{ display: hidden ? "none" : "table-row" }}>
                        <td>{r.date}</td>
                        <td>{r.name}</td>
                        <td>{r.gender}</td>
                        <td>{r.status}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {visibleRecords.length > 3 && (
                <button
                  className="add-btn"
                  onClick={() => toggleExpand(cat)}
                  style={{ marginTop: "10px" }}
                >
                  {expandedTables[cat] ? "View Less" : "View More"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttendancePage;
