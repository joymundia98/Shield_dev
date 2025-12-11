import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/global.css";

// Interfaces for Event and Attendee
interface Event {
  event_id: number;
  title: string;
  date: string;
  time: string;
  venue: string;
  category: string;
}

interface Attendee {
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  role: string;
  customRole?: string; // For custom role input
}

const NewAttendees: React.FC = () => {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>(); // Assume we're fetching the event by ID
  const [event, setEvent] = useState<Event | null>(null);
  const [attendee, setAttendee] = useState<Attendee>({
    name: "",
    email: "",
    phone: "",
    age: 0,
    gender: "",
    role: "",
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Simulating fetching the event details using eventId
    const fetchEventDetails = async () => {
      const fetchedEvent = {
        event_id: parseInt(eventId || "0", 10),
        title: "Marriage Counseling",
        date: "2025-12-20",
        time: "14:00",
        venue: "Community Hall",
        category: "Life Events",
      };
      setEvent(fetchedEvent);
    };

    fetchEventDetails();
  }, [eventId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAttendee((prevAttendee) => ({
      ...prevAttendee,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: string[] = [];
    if (!attendee.name) validationErrors.push("Name is required.");
    if (!attendee.email) validationErrors.push("Email is required.");
    if (!attendee.phone) validationErrors.push("Phone is required.");
    if (!attendee.age) validationErrors.push("Age is required.");
    if (!attendee.gender) validationErrors.push("Gender is required.");
    if (!attendee.role) validationErrors.push("Role is required.");

    if (validationErrors.length === 0) {
      console.log("Attendee added:", attendee);
      alert("Attendee registered successfully!");
      navigate(`/events/${eventId}`);
    } else {
      setErrors(validationErrors);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  if (!event) return <div>Loading event details...</div>;

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

        <h2>EVENT MANAGER</h2>
        <a href="/events/dashboard">Dashboard</a>
        <a href="/events/registered" className="active">
          Registered Events
        </a>
        <a href="/events/categories">Categories</a>
        <hr className="sidebar-separator" />
        <a href="/dashboard" className="return-main">← Back to Main Dashboard</a>
        <a href="/" className="logout-link" onClick={() => { localStorage.clear(); navigate("/"); }}>➜ Logout</a>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        <h1>Register Attendee for {event.title}</h1>

        <form className="add-form-styling" onSubmit={handleSubmit}>
          {/* Event Info Display */}
          <div className="event-info">
            <p><strong>Event:</strong> {event.title}</p>
            <p><strong>Date:</strong> {event.date}</p>
            <p><strong>Time:</strong> {event.time}</p>
            <p><strong>Venue:</strong> {event.venue}</p>
            <p><strong>Category:</strong> {event.category}</p>
          </div>

          {/* Name Field */}
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={attendee.name}
              onChange={handleChange}
              placeholder="Enter attendee's name"
              className="form-input"
            />
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={attendee.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="form-input"
            />
          </div>

          {/* Phone Field */}
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={attendee.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="form-input"
            />
          </div>

          {/* Age Field */}
          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={attendee.age}
              onChange={handleChange}
              placeholder="Enter age"
              className="form-input"
            />
          </div>

          {/* Gender Field */}
          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={attendee.gender}
              onChange={handleChange}
              className="form-input"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Role Field with Custom Role Option */}
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={attendee.role}
              onChange={handleChange}
              className="form-input"
            >
              <option value="">Select Role</option>
              <option value="Speaker">Speaker</option>
              <option value="Participant">Participant</option>
              <option value="Organizer">Organizer</option>
              <option value="Volunteer">Volunteer</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Custom Role Input Field */}
          {attendee.role === "Other" && (
            <div className="form-group">
              <label htmlFor="customRole">Custom Role</label>
              <input
                type="text"
                id="customRole"
                name="customRole"
                value={attendee.customRole || ""}
                onChange={handleChange}
                placeholder="Enter custom role"
                className="form-input"
              />
            </div>
          )}

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
              Register Attendee
            </button>&emsp;
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate(`/events/${eventId}`)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAttendees;
