import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

// Interfaces for Program and Category
interface Program {
  program_id: number;
  title: string;
  date: string;
  time: string;
  venue: string;
  agenda: string;
  status: string;
  category_id: number;
  event_type: string;
  notes: string;  // Added notes field
}

interface Category {
  category_id: number;
  name: string;
}

const AddProgram: React.FC = () => {
  const navigate = useNavigate();

  const categories: Category[] = [
    { category_id: 1, name: "Life Events" },
    { category_id: 2, name: "Church Business Events" },
    { category_id: 3, name: "Community Events" },
    { category_id: 4, name: "Spiritual Events" },
    { category_id: 5, name: "Other" },
  ];

  const spiritualEventOptions = [
    "Prayer & Fasting",
    "Overnights",
    "Communion",
    "Baptism",
    "Anointing",
    "Revival / Crusades",
    "Other",
  ];

  const [program, setProgram] = useState<Program>({
    program_id: Date.now(),
    title: "",
    date: "",
    time: "",
    venue: "",
    agenda: "",
    status: "Upcoming",
    category_id: 1,
    event_type: "",
    notes: "",  // Initialize notes field
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProgram(prevProgram => ({
      ...prevProgram,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: string[] = [];
    if (!program.title) validationErrors.push("Title is required.");
    if (!program.date) validationErrors.push("Date is required.");
    if (!program.time) validationErrors.push("Time is required.");
    if (!program.venue) validationErrors.push("Venue is required.");
    if (!program.agenda) validationErrors.push("Agenda is required.");
    if (!program.event_type) validationErrors.push("Event type is required.");

    if (validationErrors.length === 0) {
      console.log("Program submitted:", program);
      alert("Program added successfully!");
      navigate("/programs/registered");
    } else {
      setErrors(validationErrors);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

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
        <a href="/programs/registered" className="active">Registered Programs</a>
        <a href="/programs/categories">Categories</a>
        <hr className="sidebar-separator" />
        <a href="/dashboard" className="return-main">← Back to Main Dashboard</a>
        <a href="/" className="logout-link" onClick={() => { localStorage.clear(); navigate("/"); }}>➜ Logout</a>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        <h1>Add New Program</h1>

        <br/><br/>
        <form className="add-form-styling" onSubmit={handleSubmit}>
          {/* Category Field */}
          <div className="form-group">
            <label htmlFor="category_id">Category</label>
            <select
              id="category_id"
              name="category_id"
              value={program.category_id}
              onChange={handleChange}
              className="form-input"
            >
              {categories.map(category => (
                <option key={category.category_id} value={category.category_id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Event Title */}
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={program.title}
              onChange={handleChange}
              placeholder="Enter program title"
              className="form-input"
            />
          </div>

          {/* Date */}
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={program.date}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {/* Time */}
          <div className="form-group">
            <label htmlFor="time">Time</label>
            <input
              type="time"
              id="time"
              name="time"
              value={program.time}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {/* Venue */}
          <div className="form-group">
            <label htmlFor="venue">Venue</label>
            <input
              type="text"
              id="venue"
              name="venue"
              value={program.venue}
              onChange={handleChange}
              placeholder="Enter venue"
              className="form-input"
            />
          </div>

          {/* Agenda */}
          <div className="form-group">
            <label htmlFor="agenda">Agenda</label>
            <textarea
              id="agenda"
              name="agenda"
              value={program.agenda}
              onChange={handleChange}
              placeholder="Enter the event agenda"
              className="form-input"
            />
          </div>

          {/* Event Type (for Spiritual Events only) */}
          {program.category_id === 4 && (
            <div className="form-group">
              <label htmlFor="event_type">Event Type (Spiritual Events)</label>
              <select
                id="event_type"
                name="event_type"
                value={program.event_type}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Select Event Type</option>
                {spiritualEventOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Notes Field */}
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={program.notes}
              onChange={handleChange}
              placeholder="Enter any additional notes"
              className="form-input"
            />
          </div>

          {/* Error messages */}
          {errors.length > 0 && (
            <div className="error-messages">
              <ul>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Submit and Cancel buttons */}
          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Add Program
            </button>&emsp;
            <button type="button" className="cancel-btn" onClick={() => navigate("/programs/registered")}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProgram;
