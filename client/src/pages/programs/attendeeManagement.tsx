import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

type Gender = "Male" | "Female";
type Category = "Life Event" | "Church Business Event" | "Community Event" | "Spiritual Event";
type Role = "Speaker" | "Participant" | "Volunteer" | "Organizer";

interface Attendee {
  attendee_id: number;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: Gender;
  program_id: number;
  role: Role;
}

interface Program {
  id: number;
  name: string;
  description: string;
  department: string;
  date: string;
  time: string;
  venue: string;
  status: string;
  event_type: string;
  category_id: number;
}

const AttendeeManagement: React.FC = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>("Life Event");
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [attendees, setAttendees] = useState<Attendee[]>([]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const categoryMapping: Record<Category, number> = {
    "Life Event": 1,
    "Church Business Event": 2,
    "Community Event": 3,
    "Spiritual Event": 4,
  };

  // Fetch Programs from Backend
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/programs");
        const data = await response.json();
        setPrograms(data);
        console.log("Fetched Programs:", data);
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    };
    fetchPrograms();
  }, []);

  // Fetch Attendees for Selected Program
  useEffect(() => {
    if (selectedProgram === null) return; // Skip fetch if no program is selected

    const fetchAttendees = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/programs/attendees?program_id=${selectedProgram}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch attendees. Status: ${response.status}`);
        }
        const data = await response.json();
        setAttendees(data);
        console.log("Fetched Attendees:", data);
      } catch (error) {
        console.error("Error fetching attendees:", error);
      }
    };

    console.log("Fetching attendees for program:", selectedProgram);
    fetchAttendees();
  }, [selectedProgram]);

  const filteredAttendees = selectedProgram
    ? attendees.filter((attendee) => attendee.program_id === selectedProgram)
    : [];

  // Handle Edit Attendee (Placeholder function)
  const handleEditAttendee = (attendeeId: number) => {
    console.log(`Editing attendee with ID: ${attendeeId}`);
    navigate(`/programs/editAttendee/${attendeeId}`);
  };

  // Handle Delete Attendee (Placeholder function)
  const handleDeleteAttendee = (attendeeId: number) => {
    console.log(`Deleting attendee with ID: ${attendeeId}`);
    setAttendees(attendees.filter(attendee => attendee.attendee_id !== attendeeId));
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

        <h2>PROGRAM MANAGER</h2>
        <a href="/programs/dashboard">Dashboard</a>
        <a href="/programs/RegisteredPrograms">Registered Programs</a>
        <a href="/programs/attendeeManagement" className="active">Attendee Management</a>
        <hr className="sidebar-separator" />
        <a href="/dashboard" className="return-main">← Back to Main Dashboard</a>
        <a href="/" className="logout-link" onClick={(e) => { e.preventDefault(); localStorage.clear(); navigate("/"); }}>➜ Logout</a>
      </div>

      <div className="dashboard-content">
        <h1>Manage Attendees</h1>

        {/* Category and Program Selection */}
        <div className="kpi-container">
          <div className="kpi-card selection-card">
            <h3>Select Event Category</h3>
            <div className="rollcall-radio">
              {(["Life Event", "Church Business Event", "Community Event", "Spiritual Event"] as Category[]).map((category) => (
                <label key={category}>
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === category}
                    onChange={() => {
                      setSelectedCategory(category);
                      setSelectedProgram(null); // Reset program selection when category changes
                    }}
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>

          <div className="kpi-card selection-card">
            <h3>Select Program</h3>
            <select
              value={selectedProgram ?? ""}
              onChange={(e) => setSelectedProgram(Number(e.target.value))}
            >
              <option value="">Select a program</option>
              {programs
                .filter((program) => program.category_id === categoryMapping[selectedCategory])
                .map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Add Attendee Button */}
          <div className="kpi-card selection-card">
            <button
              className="add-btn"
              onClick={() => {
                if (selectedProgram) {
                  navigate(`/programs/addAttendees/${selectedProgram}`);
                } else {
                  alert("Please select a program first.");
                }
              }}
            >
              + Add Attendee
            </button>
          </div>
        </div>

        <div className="attendance-group">
          <h3>Attendees for {selectedProgram ? programs.find(p => p.id === selectedProgram)?.name : "Select a Program"}</h3>

          {filteredAttendees.length === 0 ? (
            <p>No Registered Attendees for this event</p>
          ) : (
            <table className="responsive-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Program</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendees.map((attendee) => (
                  <tr key={attendee.attendee_id}>
                    <td>{attendee.name}</td>
                    <td>{attendee.email}</td>
                    <td>{attendee.phone}</td>
                    <td>{attendee.age}</td>
                    <td>{attendee.gender}</td>
                    <td>{programs.find(p => p.id === attendee.program_id)?.name}</td>
                    <td>{attendee.role}</td>
                    <td>
                      <button className="edit-btn" onClick={() => handleEditAttendee(attendee.attendee_id)}>Edit</button>&emsp;
                      <button className="delete-btn" onClick={() => handleDeleteAttendee(attendee.attendee_id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendeeManagement;
