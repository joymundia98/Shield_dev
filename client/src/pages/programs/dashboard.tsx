import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

// Define event type interface
interface Event {
  id: number;
  name: string;
  date: string;
  time: string;
  status: "Scheduled" | "Completed" | "Upcoming";
  category_id: number;
  event_type: string;
  link: string;
}

const ProgramsDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState<Event[]>([]);

  // Fetch events from backend on component mount
  useEffect(() => {
    fetch("http://localhost:3000/api/programs")
      .then((response) => response.json())
      .then((data) => setEvents(data));
  }, []);

  // Sidebar state and logic
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const body = document.body;
    if (sidebarOpen) {
      body.classList.add("sidebar-open");
    } else {
      body.classList.remove("sidebar-open");
    }
    return () => body.classList.remove("sidebar-open");
  }, [sidebarOpen]);

  // Categories for filtering events
  const categories = [
    { category_id: 1, name: "Life Events" },
    { category_id: 2, name: "Church Business Events" },
    { category_id: 3, name: "Community Events" },
    { category_id: 4, name: "Spiritual Events" },
    { category_id: 5, name: "Other" },
  ];

  // Function to get upcoming events for a given category
  const getUpcomingEvents = (category: string) => {
    const categoryMap = {
      "Life Events": 1,
      "Church Business Events": 2,
      "Community Events": 3,
      "Spiritual Events": 4,
      "Other": 5,
    };

    const categoryId = categoryMap[category];

    const upcomingEvents = events
      .filter((event) => event.category_id === categoryId && event.status === "Scheduled")
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sort by date (ascending)
      .slice(0, 3); // Limit to top 3 upcoming events

    return upcomingEvents;
  };

  // Table generator with category name in the header, including time
  const makeTable = (category: string) => {
    const upcomingEvents = getUpcomingEvents(category);

    return (
      <table className="responsive-table">
        <thead>
          <tr>
            <th>{category} Events</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Manage</th>
          </tr>
        </thead>
        <tbody>
          {upcomingEvents.map((e) => (
            <tr key={e.id}>
              <td>{e.name}</td>
              <td>{new Date(e.date).toLocaleDateString()}</td>
              <td>{e.time}</td>
              <td>{e.status}</td>
              <td>
                <a className="table-btn" href={`/programs/viewProgram?id=${e.id}`}>
                  Open
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Additional table for "Other Events"
  const makeOtherEventsTable = () => {
    const otherEvents = getUpcomingEvents("Other");

    return (
      <table className="responsive-table">
        <thead>
          <tr>
            <th>Other Events</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Manage</th>
          </tr>
        </thead>
        <tbody>
          {otherEvents.map((e) => (
            <tr key={e.id}>
              <td>{e.name}</td>
              <td>{new Date(e.date).toLocaleDateString()}</td>
              <td>{e.time}</td>
              <td>{e.status}</td>
              <td>
                <a className="table-btn" href={`/programs/viewProgram?id=${e.id}`}>
                  Open
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // KPI Counts (grouped by category)
  const groupCounts = useMemo(() => {
    const counts = { "Life Events": 0, "Church Business Events": 0, "Community Events": 0, "Spiritual Events": 0, "Other": 0 };

    events.forEach((e) => {
      const categoryMap = {
        1: "Life Events",
        2: "Church Business Events",
        3: "Community Events",
        4: "Spiritual Events",
        5: "Other",
      };

      const categoryName = categoryMap[e.category_id];
      counts[categoryName]++;
    });

    return counts;
  }, [events]);

  return (
    <div className="dashboard-wrapper">
      {/* Hamburger */}
      <button className="hamburger" onClick={toggleSidebar}>
        &#9776;
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`} id="sidebar">
        {/* Close Button */}
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

        <h2>PROGRAM MANAGER</h2>
        <a href="/programs/dashboard">Dashboard</a>
        <a href="/programs/RegisteredPrograms" className="active">
          Registered Programs
        </a>
        <a href="/programs/attendeeManagement">Attendee Management</a>

        <hr className="sidebar-separator" />
        <a href="/dashboard" className="return-main">
          ← Back to Main Dashboard
        </a>
        <a
          href="/"
          className="logout-link"
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
        >
          ➜ Logout
        </a>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        <h1>Programs & Events Overview</h1>

        <div className="kpi-container">
          <div className="kpi-card">
            <h3>Life Events</h3>
            <p>{groupCounts["Life Events"]}</p>
          </div>
          <div className="kpi-card">
            <h3>Church Business Events</h3>
            <p>{groupCounts["Church Business Events"]}</p>
          </div>
          <div className="kpi-card">
            <h3>Community Events</h3>
            <p>{groupCounts["Community Events"]}</p>
          </div>
          <div className="kpi-card">
            <h3>Spiritual Events</h3>
            <p>{groupCounts["Spiritual Events"]}</p>
          </div>
          <div className="kpi-card">
            <h3>Other Events</h3>
            <p>{groupCounts["Other"]}</p>
          </div>
        </div>

        <h2>Upcoming Life Events</h2>
        {makeTable("Life Events")}

        <h2>Upcoming Church Business Events</h2>
        {makeTable("Church Business Events")}

        <h2>Upcoming Community Events</h2>
        {makeTable("Community Events")}

        <h2>Upcoming Spiritual Events</h2>
        {makeTable("Spiritual Events")}

        <h2>Upcoming Other Events</h2>
        {makeOtherEventsTable()}
      </div>
    </div>
  );
};

export default ProgramsDashboard;
