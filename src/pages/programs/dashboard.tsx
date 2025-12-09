import React, { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";
import "../../styles/global.css";

interface Event {
  type: "Spiritual" | "Life" | "Community" | "Business";
  name: string;
  date: string;
  status: "Upcoming" | "Completed";
  male: number;
  female: number;
  link: string;
}

const ProgramsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const statusChartRef = useRef<Chart | null>(null);
  const genderChartRef = useRef<Chart | null>(null);

  const events: Event[] = useMemo(
    () => [
      { type: "Spiritual", name: "Morning Prayer", date: "2025-11-22", status: "Upcoming", male: 10, female: 15, link: "SpiritualEvents/PrayerFasting.html" },
      { type: "Spiritual", name: "Overnight Prayer", date: "2025-11-25", status: "Upcoming", male: 14, female: 20, link: "SpiritualEvents/Overnights.html" },
      { type: "Life", name: "Wedding - John & Jane", date: "2025-12-05", status: "Upcoming", male: 50, female: 50, link: "LifeEvents/Wedding.html" },
      { type: "Life", name: "Child Dedication", date: "2025-12-10", status: "Upcoming", male: 10, female: 12, link: "LifeEvents/ChildDedication.html" },
      { type: "Community", name: "Outreach Evangelism", date: "2025-12-12", status: "Upcoming", male: 8, female: 10, link: "CommunityEvents/OutreachEvangelism.html" },
      { type: "Community", name: "Conference 2025", date: "2025-12-20", status: "Upcoming", male: 25, female: 30, link: "CommunityEvents/Conferences.html" },
      { type: "Business", name: "Board Meeting", date: "2025-12-15", status: "Upcoming", male: 5, female: 3, link: "ChurchBusiness/BusinessMeetings.html" },
    ],
    []
  );

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

  // KPI counts
  const groupCounts = useMemo(() => {
    const counts = { Spiritual: 0, Life: 0, Community: 0, Business: 0 };
    events.forEach(e => counts[e.type]++);
    return counts;
  }, [events]);

  useEffect(() => {
    // Destroy previous charts if exist
    statusChartRef.current?.destroy();
    genderChartRef.current?.destroy();

    // Status chart
    const statusData = { Upcoming: 0, Completed: 0 };
    events.forEach(e => statusData[e.status]++);
    const statusCtx = document.getElementById("statusChart") as HTMLCanvasElement;
    if (statusCtx) {
      statusChartRef.current = new Chart(statusCtx, {
        type: "doughnut",
        data: {
          labels: ["Upcoming", "Completed"],
          datasets: [{ data: [statusData.Upcoming, statusData.Completed], backgroundColor: ["#1A3D7C", "#27ae60"] }],
        },
      });
    }

    // Gender chart
    const genderCounts: Record<string, { male: number; female: number }> = {
      Spiritual: { male: 0, female: 0 },
      Life: { male: 0, female: 0 },
      Community: { male: 0, female: 0 },
      Business: { male: 0, female: 0 },
    };
    events.forEach(e => {
      genderCounts[e.type].male += e.male;
      genderCounts[e.type].female += e.female;
    });
    const genderCtx = document.getElementById("genderChart") as HTMLCanvasElement;
    if (genderCtx) {
      genderChartRef.current = new Chart(genderCtx, {
        type: "bar",
        data: {
          labels: ["Spiritual", "Life", "Community", "Business"],
          datasets: [
            { label: "Male", data: ["Spiritual","Life","Community","Business"].map(t => genderCounts[t].male), backgroundColor: "#1A3D7C" },
            { label: "Female", data: ["Spiritual","Life","Community","Business"].map(t => genderCounts[t].female), backgroundColor: "#AF907A" },
          ],
        },
      });
    }
  }, [events]);

  // Table generator
  const makeTable = (type: string) => {
    const filtered = events.filter(e => e.type === type && e.status === "Upcoming");
    return (
      <table className="responsive-table">
        <thead>
          <tr>
            <th>Event</th>
            <th>Date</th>
            <th>Status</th>
            <th>Participants (M/F)</th>
            <th>Manage</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((e, idx) => (
            <tr key={idx}>
              <td>{e.name}</td>
              <td>{e.date}</td>
              <td>{e.status}</td>
              <td>{e.male}/{e.female}</td>
              <td><a className="table-btn" href={e.link}>Open</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="dashboard-wrapper">
      {/* Hamburger */}
      <button className="hamburger" onClick={toggleSidebar}>&#9776;</button>

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

        <h2>PROGRAMS & EVENTS</h2>
        <a href="#" className="active">Dashboard</a>

        <h3 className="sidebar-section-title">Spiritual Events</h3>
        <a href="/spiritual/prayer-fasting">Prayer & Fasting</a>
        <a href="/spiritual/overnights">Overnights</a>
        <a href="/spiritual/communion">Communion</a>
        <a href="/spiritual/baptism">Baptism</a>
        <a href="/spiritual/anointing">Anointing</a>
        <a href="/spiritual/revival-crusades">Revival / Crusades</a>

        <h3 className="sidebar-section-title">Life Events</h3>
        <a href="/life/weddings">Weddings</a>
        <a href="/life/child-dedication">Child Dedication</a>
        <a href="/life/naming">Child Naming</a>
        <a href="/life/funeral">Funeral & Memorials</a>

        <h3 className="sidebar-section-title">Community Events</h3>
        <a href="/community/outreach">Outreach & Evangelism</a>
        <a href="/community/conferences">Conferences</a>

        <h3 className="sidebar-section-title">Church Business</h3>
        <a href="/business/meetings">Business Meetings</a>

        <hr className="sidebar-separator"/>
        <a href="/dashboard" className="return-main">← Back to Main Dashboard</a>
        <a href="/" className="logout-link" onClick={() => { localStorage.clear(); navigate("/"); }}>➜] Logout</a>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        <h1>Programs & Events Overview</h1>

        {/* KPI cards */}
        <div className="kpi-container">
          <div className="kpi-card"><h3>Spiritual Events</h3><p>{groupCounts.Spiritual}</p></div>
          <div className="kpi-card"><h3>Life Events</h3><p>{groupCounts.Life}</p></div>
          <div className="kpi-card"><h3>Community Events</h3><p>{groupCounts.Community}</p></div>
          <div className="kpi-card"><h3>Business Meetings</h3><p>{groupCounts.Business}</p></div>
        </div>

        {/* Charts */}
        <div className="chart-grid">
          <div className="chart-box">
            <h3>Event Status Distribution</h3>
            <canvas id="statusChart"></canvas>
          </div>
          <div className="chart-box">
            <h3>Gender Participation</h3>
            <canvas id="genderChart"></canvas>
          </div>
        </div>

        {/* Tables */}
        <h2>Upcoming Spiritual Events</h2>{makeTable("Spiritual")}
        <h2>Upcoming Life Events</h2>{makeTable("Life")}
        <h2>Upcoming Community Events</h2>{makeTable("Community")}
        <h2>Upcoming Business Meetings</h2>{makeTable("Business")}
      </div>
    </div>
  );
};

export default ProgramsDashboard;
