import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/global.css";

type Gender = "Male" | "Female";
type Category = "Children" | "Youth" | "Adults" | "Elderly";

interface Member {
  member_id: number;
  full_name: string;
  age: number;
  gender: Gender;
}

interface AttendanceRecord {
  member_id: number;
  date: string;
  status: "Present" | "Absent";
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

  // Members from backend
  const [members, setMembers] = useState<Member[]>([]);
  const [attendance, setAttendance] = useState<Record<number, boolean>>({});

  // Map age to category
  const getCategory = (age: number): Category => {
    if (age < 18) return "Children";
    if (age <= 30) return "Youth";
    if (age <= 60) return "Adults";
    return "Elderly";
  };

  // Fetch members from backend when category or gender changes
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get<Member[]>("http://localhost:3000/api/members");
        // Filter by selected category and gender
        const filtered = res.data
          .filter((m) => getCategory(m.age) === category && m.gender === gender)
          .sort((a, b) => a.full_name.localeCompare(b.full_name)); // alphabetical order

        setMembers(filtered);

        // Initialize attendance state
        const initialState: Record<number, boolean> = {};
        filtered.forEach((m) => { initialState[m.member_id] = false; });
        setAttendance(initialState);
      } catch (err) {
        console.error("Error fetching members:", err);
      }
    };

    fetchMembers();
  }, [category, gender]);

  // Handle checkbox toggle
  const toggleCheck = (member_id: number) => {
    setAttendance((prev) => ({ ...prev, [member_id]: !prev[member_id] }));
  };

  // Save attendance
  const saveAttendance = async () => {
    const today = new Date().toISOString().split("T")[0];

    const records: AttendanceRecord[] = members.map((m) => ({
      member_id: m.member_id,
      date: today,
      status: attendance[m.member_id] ? "Present" : "Absent",
    }));

    try {
      await axios.post("http://localhost:3000/api/attendance", { records });
      alert("Attendance saved successfully!");
      navigate("/congregation/attendance");
    } catch (err) {
      console.error("Error saving attendance:", err);
      alert("Failed to save attendance.");
    }
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
        <a href="/" className="logout-link" onClick={(e) => { e.preventDefault(); localStorage.clear(); navigate("/"); }}>➜ Logout</a>
      </div>

      {/* MAIN CONTENT */}
      <div className="dashboard-content attendanceRollCall">
        <header>
          <h1>Record Attendance</h1>
          <br />
          <button className="add-btn" onClick={() => navigate("/congregation/attendance")}>
            ← Back to Attendance Records
          </button>
        </header>

        <br /><br />

        {/* KPI SELECTION CARDS */}
        <div className="kpi-container">
          {/* CATEGORY */}
          <div className="kpi-card selection-card">
            <h3>Select Category</h3>
            <div className="rollcall-radio">
              {(["Children", "Youth", "Adults", "Elderly"] as Category[]).map((cat) => (
                <label key={cat}>
                  <input type="radio" name="category" checked={category === cat} onChange={() => setCategory(cat)} />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          {/* GENDER */}
          <div className="kpi-card selection-card">
            <h3>Select Gender</h3>
            <div className="rollcall-radio">
              {(["Male", "Female"] as Gender[]).map((g) => (
                <label key={g}>
                  <input type="radio" name="gender" checked={gender === g} onChange={() => setGender(g)} />
                  {g}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* ATTENDANCE LIST */}
        <div className="attendance-group">
          <h3>{category} — {gender}</h3>
          <div className="rollcall-list">
            {members.map((m) => (
              <label key={m.member_id}>
                <input
                  type="checkbox"
                  checked={attendance[m.member_id] || false}
                  onChange={() => toggleCheck(m.member_id)}
                />
                {m.full_name}
              </label>
            ))}
          </div>
        </div>

        {/* SAVE BUTTON */}
        <button className="add-btn" style={{ marginTop: 20 }} onClick={saveAttendance}>
          Save Attendance
        </button>
      </div>
    </div>
  );
};

export default RecordAttendance;
