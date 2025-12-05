import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/global.css";

type Gender = "Male" | "Female";
type Category = "Children" | "Youth" | "Adults" | "Elderly";

interface Person {
  id: number;       // member_id or visitor id
  name: string;     // full_name for members, name for visitors
  age: number;
  gender: Gender;
  type: "member" | "visitor";
}

interface AttendanceRecord {
  person_id: number;
  type: "member" | "visitor";
  date: string;
  status: "Present" | "Absent";
}

const RecordAttendance: React.FC = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [category, setCategory] = useState<Category>("Children");
  const [gender, setGender] = useState<Gender>("Male");

  const [people, setPeople] = useState<Person[]>([]);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});

  const getCategory = (age: number): Category => {
    if (age < 18) return "Children";
    if (age <= 30) return "Youth";
    if (age <= 60) return "Adults";
    return "Elderly";
  };

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const [membersRes, visitorsRes] = await Promise.all([
          axios.get("http://localhost:3000/api/members"),
          axios.get("http://localhost:3000/api/visitor")
        ]);

        const allMembers: Person[] = membersRes.data.map((m: any) => ({
          id: m.member_id,
          name: m.full_name,
          age: m.age,
          gender: m.gender,
          type: "member",
        }));

        const allVisitors: Person[] = visitorsRes.data.map((v: any) => ({
          id: v.id,
          name: v.name,
          age: v.age,
          gender: v.gender,
          type: "visitor",
        }));

        const allPeople = [...allMembers, ...allVisitors];

        const filtered = allPeople
          .filter(p => getCategory(p.age) === category && p.gender === gender)
          .sort((a, b) => a.name.localeCompare(b.name));

        setPeople(filtered);

        // Initialize attendance state using composite key: type_id
        const initialAttendance: Record<string, boolean> = {};
        filtered.forEach(p => {
          initialAttendance[`${p.type}_${p.id}`] = false;
        });
        setAttendance(initialAttendance);

      } catch (err) {
        console.error("Error fetching people:", err);
      }
    };

    fetchPeople();
  }, [category, gender]);

  const toggleCheck = (key: string) => {
    setAttendance(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const saveAttendance = async () => {
    const today = new Date().toISOString().split("T")[0];

    const records: AttendanceRecord[] = people.map(p => ({
      person_id: p.id,
      type: p.type,
      date: today,
      status: attendance[`${p.type}_${p.id}`] ? "Present" : "Absent",
    }));

    try {
      await axios.post("http://localhost:3000/api/congregation/attendance", { records });
      alert("Attendance saved successfully!");
      navigate("/congregation/attendance");
    } catch (err) {
      console.error("Error saving attendance:", err);
      alert("Failed to save attendance.");
    }
  };

  return (
    <div className="dashboard-wrapper">
      <button className="hamburger" onClick={toggleSidebar}>&#9776;</button>
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

      <div className="dashboard-content attendanceRollCall">
        <header>
          <h1>Record Attendance</h1>
          <br />
          <button className="add-btn" onClick={() => navigate("/congregation/attendance")}>← Back to Attendance Records</button>
        </header>
        <br /><br />

        <div className="kpi-container">
          <div className="kpi-card selection-card">
            <h3>Select Category</h3>
            <div className="rollcall-radio">
              {(["Children","Youth","Adults","Elderly"] as Category[]).map((cat) => (
                <label key={cat}>
                  <input type="radio" name="category" checked={category === cat} onChange={() => setCategory(cat)} />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          <div className="kpi-card selection-card">
            <h3>Select Gender</h3>
            <div className="rollcall-radio">
              {(["Male","Female"] as Gender[]).map((g) => (
                <label key={g}>
                  <input type="radio" name="gender" checked={gender === g} onChange={() => setGender(g)} />
                  {g}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="attendance-group">
          <h3>{category} — {gender}</h3>
          <div className="rollcall-list">
            {people.map(p => (
              <label key={`${p.type}_${p.id}`}>
                <input
                  type="checkbox"
                  checked={attendance[`${p.type}_${p.id}`] || false}
                  onChange={() => toggleCheck(`${p.type}_${p.id}`)}
                />
                {p.name} {p.type === "visitor" ? "(Visitor)" : ""}
              </label>
            ))}
          </div>
        </div>

        <button className="add-btn" style={{ marginTop: 20 }} onClick={saveAttendance}>Save Attendance</button>
      </div>
    </div>
  );
};

export default RecordAttendance;
