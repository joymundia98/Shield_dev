import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

type Gender = "Male" | "Female";
type Category = "Children" | "Adults";

interface AttendanceRecord {
  date: string;
  name: string;
  gender: Gender;
  status: "Present" | "Absent";
}

interface StoredAttendance {
  [category: string]: AttendanceRecord[];
}

const RecordAttendance: React.FC = () => {
  const navigate = useNavigate();

  // Sidebar control
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    if (sidebarOpen) document.body.classList.add("sidebar-open");
    else document.body.classList.remove("sidebar-open");

    return () => document.body.classList.remove("sidebar-open");
  }, [sidebarOpen]);

  // Category + Gender selection
  const [category, setCategory] = useState<Category>("Children");
  const [gender, setGender] = useState<Gender>("Male");

  // Attendance checkbox state
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});

  // PEOPLE LIST (static for now)
  const people = {
    Children: {
      Male: ["Tommy", "Sam"],
      Female: ["Lucy", "Anna"],
    },
    Adults: {
      Male: ["John Doe", "Bob"],
      Female: ["Mary Smith", "Alice"],
    },
  };

  // Ensure checkboxes reset when switching category/gender
  useEffect(() => {
    const newState: Record<string, boolean> = {};
    people[category][gender].forEach((name) => {
      newState[name] = attendance[name] ?? false;
    });
    setAttendance(newState);
  }, [category, gender]);

  // Handle checkbox toggle
  const toggleCheck = (name: string) => {
    setAttendance((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // Save attendance
  const saveAttendance = () => {
    const today = new Date().toISOString().split("T")[0];

    const stored: StoredAttendance =
      JSON.parse(localStorage.getItem("attendanceData") || "{}");

    if (!stored[category]) stored[category] = [];

    people[category][gender].forEach((name) => {
      stored[category].push({
        date: today,
        name,
        gender,
        status: attendance[name] ? "Present" : "Absent",
      });
    });

    localStorage.setItem("attendanceData", JSON.stringify(stored));
    alert("Attendance Saved!");
    navigate("/congregation/attendance");
  };

  return (
    <div className="dashboard-wrapper">
      {/* HAMBURGER */}
      <button className="hamburger" onClick={toggleSidebar}>
        &#9776;
      </button>

      {/* SIDEBAR */}
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

        <h2>CONGREGATION</h2>
        <a href="/congregation/dashboard">Dashboard</a>
        <a href="/congregation/members">Members</a>
        <a href="/congregation/attendance" className="active">
          Attendance
        </a>
        <a href="/congregation/followups">Follow-ups</a>
        <a href="/congregation/visitors">Visitors</a>
        <a href="/congregation/converts">New Converts</a>

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
          ➜ Logout
        </a>
      </div>

      {/* MAIN CONTENT */}
      <div className="dashboard-content attendanceRollCall">
        <header>
          <h1>Record Attendance</h1>

          <br />

          <button
            className="add-btn"
            onClick={() => navigate("/congregation/attendance")}
          >
            ← Back to Attendance Records
          </button>
        </header>

        <br />
        <br />

        {/* KPI SELECTION CARDS */}
        <div className="kpi-container">
          {/* CATEGORY */}
          <div className="kpi-card selection-card">
            <h3>Select Category</h3>
            <div className="rollcall-radio">
              <label>
                <input
                  type="radio"
                  name="category"
                  checked={category === "Children"}
                  onChange={() => setCategory("Children")}
                />
                Children
              </label>

              <label>
                <input
                  type="radio"
                  name="category"
                  checked={category === "Adults"}
                  onChange={() => setCategory("Adults")}
                />
                Adults
              </label>
            </div>
          </div>

          {/* GENDER */}
          <div className="kpi-card selection-card">
            <h3>Select Gender</h3>
            <div className="rollcall-radio">
              <label>
                <input
                  type="radio"
                  name="gender"
                  checked={gender === "Male"}
                  onChange={() => setGender("Male")}
                />
                Male
              </label>

              <label>
                <input
                  type="radio"
                  name="gender"
                  checked={gender === "Female"}
                  onChange={() => setGender("Female")}
                />
                Female
              </label>
            </div>
          </div>
        </div>

        {/* ATTENDANCE LIST */}
        <div className="attendance-group">
          <h3>
            {category} — {gender}
          </h3>

          <div className="rollcall-list">
            {people[category][gender].map((name) => (
              <label key={name}>
                <input
                  type="checkbox"
                  checked={attendance[name] || false}
                  onChange={() => toggleCheck(name)}
                />
                {name}
              </label>
            ))}
          </div>
        </div>

        {/* SAVE BUTTON */}
        <button
          className="add-btn"
          onClick={saveAttendance}
          style={{ marginTop: 20 }}
        >
          Save Attendance
        </button>
      </div>
    </div>
  );
};

export default RecordAttendance;
