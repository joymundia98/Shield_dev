import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

// Types for Attendee Gender, Program Category, and Attendee Role
type Gender = "Male" | "Female";
type Category = "Life Event" | "Church Business Event" | "Community Event" | "Spiritual Event";
type Role = "Speaker" | "Participant" | "Volunteer" | "Organizer";

interface Attendee {
  id: number;
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
  title: string;
  category: Category;
}

const AttendeeManagement: React.FC = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [selectedCategory, setSelectedCategory] = useState<Category>("Life Event");
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null);
  const [programs, setPrograms] = useState<Program[]>([
    { id: 1, title: "Marriage Counseling", category: "Life Event" },
    { id: 2, title: "Annual Meeting", category: "Church Business Event" },
    { id: 3, title: "Community Outreach", category: "Community Event" },
    { id: 4, title: "Spiritual Retreat", category: "Spiritual Event" },
  ]);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [roles] = useState<Role[]>(["Speaker", "Participant", "Volunteer", "Organizer"]);

  useEffect(() => {
    // Static data for attendees based on selected program
    const fetchAttendees = () => {
      const staticAttendees: Attendee[] = [
        { id: 1, name: "John Doe", email: "john.doe@example.com", phone: "123-456-7890", age: 30, gender: "Male", program_id: 1, role: "Speaker" },
        { id: 2, name: "Jane Smith", email: "jane.smith@example.com", phone: "987-654-3210", age: 25, gender: "Female", program_id: 1, role: "Participant" },
        { id: 3, name: "Michael Johnson", email: "michael.johnson@example.com", phone: "555-123-4567", age: 40, gender: "Male", program_id: 2, role: "Volunteer" },
        { id: 4, name: "Emily Davis", email: "emily.davis@example.com", phone: "555-987-6543", age: 35, gender: "Female", program_id: 2, role: "Organizer" },
        { id: 5, name: "Chris Lee", email: "chris.lee@example.com", phone: "555-555-5555", age: 28, gender: "Male", program_id: 3, role: "Participant" },
        { id: 6, name: "Amanda Brown", email: "amanda.brown@example.com", phone: "555-111-2222", age: 22, gender: "Female", program_id: 3, role: "Speaker" },
        { id: 7, name: "David Wilson", email: "david.wilson@example.com", phone: "555-333-4444", age: 45, gender: "Male", program_id: 4, role: "Volunteer" },
        { id: 8, name: "Sophia Harris", email: "sophia.harris@example.com", phone: "555-666-7777", age: 55, gender: "Female", program_id: 4, role: "Organizer" },
      ];

      const filteredAttendees = staticAttendees.filter(attendee => attendee.program_id === selectedProgram);
      setAttendees(filteredAttendees);
    };

    if (selectedProgram !== null) {
      fetchAttendees();
    }
  }, [selectedProgram]);

  // Handle selecting a category
  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category);
    setSelectedProgram(null);  // Reset selected program
  };

  // Handle selecting a program
  const handleProgramChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProgram(Number(event.target.value));
  };

  // Handle adding a new attendee
  const handleAddAttendee = () => {
    navigate("/programs/addAttendees");  // Assuming you have an "Add Attendee" page for adding new attendees
  };

  // Handle editing an attendee
  const handleEditAttendee = (id: number) => {
    navigate(`/attendees/edit/${id}`);
  };

  // Handle deleting an attendee
  const handleDeleteAttendee = (id: number) => {
    if (window.confirm("Are you sure you want to delete this attendee?")) {
      setAttendees(prevAttendees => prevAttendees.filter(attendee => attendee.id !== id));
    }
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <button className="hamburger" onClick={toggleSidebar}>&#9776;</button>
      <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="close-wrapper">
          <div className="toggle close-btn">
            <input type="checkbox" checked={sidebarOpen} onChange={toggleSidebar} />
            <span className="button"></span>
            <span className="label">X</span>
          </div>
        </div>

        <h2>ATTENDEE MANAGEMENT</h2>
        <a href="/attendees/dashboard">Dashboard</a>
        <a href="/attendees/manage" className="active">Manage Attendees</a>
        <hr className="sidebar-separator" />
        <a href="/dashboard" className="return-main">← Back to Main Dashboard</a>
        <a href="/" className="logout-link" onClick={(e) => { e.preventDefault(); localStorage.clear(); navigate("/"); }}>➜ Logout</a>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        <h1>Manage Attendees</h1>

        <br/><br/>
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
                    onChange={() => handleCategoryChange(category)}
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>

          <div className="kpi-card selection-card">
            <h3>Select Program</h3>
            <select value={selectedProgram ?? ""} onChange={handleProgramChange}>
              <option value="">Select a program</option>
              {programs.filter(program => program.category === selectedCategory).map((program) => (
                <option key={program.id} value={program.id}>
                  {program.title}
                </option>
              ))}
            </select>
          </div>

          {/* Add Attendee Button */}
          <div className="kpi-card selection-card">
            <button className="add-btn" onClick={handleAddAttendee}>+ Add Attendee</button>
          </div>
        </div>

        <br/>
        {/* Attendee Table */}
        <div className="attendance-group">
          <h3>Attendees for {selectedCategory} - {programs.find(p => p.id === selectedProgram)?.title}</h3>
          <table className="responsive-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Meeting</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendees.map((attendee) => (
                <tr key={attendee.id}>
                  <td>{attendee.name}</td>
                  <td>{attendee.email}</td>
                  <td>{attendee.phone}</td>
                  <td>{attendee.age}</td>
                  <td>{attendee.gender}</td>
                  <td>{programs.find(p => p.id === attendee.program_id)?.title}</td>
                  <td>{attendee.role}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEditAttendee(attendee.id)}>Edit</button>&emsp;
                    <button className="delete-btn" onClick={() => handleDeleteAttendee(attendee.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendeeManagement;
