import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

interface VisitorForm {
  photoFile?: File | null;
  photoUrl: string;
  name: string;
  gender: "Male" | "Female" | "";
  age: number | "";
  visitDate: string;
  address: string;
  phone: string;
  email: string;
  invitedBy: string;
  serviceAttended: string;
  foundBy: string;
  firstTime: boolean;
  needsFollowUp: boolean;
}

const AddVisitorPage: React.FC = () => {
  const navigate = useNavigate();

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    if (sidebarOpen) document.body.classList.add("sidebar-open");
    else document.body.classList.remove("sidebar-open");

    return () => document.body.classList.remove("sidebar-open");
  }, [sidebarOpen]);

  // -------------------------
  // FORM STATE
  // -------------------------
  const [formData, setFormData] = useState<VisitorForm>({
    photoFile: null,
    photoUrl: "",
    name: "",
    gender: "",
    age: "",
    visitDate: "",
    address: "",
    phone: "",
    email: "",
    invitedBy: "",
    serviceAttended: "",
    foundBy: "",
    firstTime: false,
    needsFollowUp: false,
  });

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, photoFile: file }));
  };

  // -------------------------
  // SUBMIT FORM
  // -------------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const visitor = {
      ...formData,
      photo: formData.photoUrl || (formData.photoFile ? formData.photoFile.name : ""),
    };

    console.log("New Visitor Data:", visitor);
    alert("Visitor added successfully (check console for data).");

    // TODO: Add POST API call here.
  };

  return (
    <div className="dashboard-wrapper visitors-wrapper">
      {/* Hamburger */}
      <button className="hamburger" onClick={toggleSidebar}>
        &#9776;
      </button>

      {/* Sidebar */}
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
        <a href="/congregation/attendance">Attendance</a>
        <a href="/congregation/followups">Follow-ups</a>
        <a href="/congregation/visitors" className="active">Visitors</a>
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

      {/* Main Content */}
      <div className="dashboard-content">
        <header>
          <h1>Add New Visitor</h1>
          <div className="header-buttons" style={{ marginTop: 10 }}>
            <button className="add-btn" onClick={() => navigate("/congregation/visitorRecords")}>
              ← Visitor Records
            </button>
            &nbsp;&nbsp;
            <button className="add-btn" onClick={() => navigate("/congregation/visitors")}>
              ← Visitors Overview
            </button>
          </div>
        </header>

        <div className="FormContainer">
          <form onSubmit={handleSubmit}>
            <label>Photo</label>
            <input type="file" accept="image/*" onChange={handlePhotoFile} />

            <small>Or enter a URL:</small>
            <input
              type="text"
              name="photoUrl"
              placeholder="https://example.com/photo.jpg"
              value={formData.photoUrl}
              onChange={handleChange}
            />

            <label>Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
            />

            <label>Gender</label>
            <select
              name="gender"
              required
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>

            <label>Age</label>
            <input
              type="number"
              name="age"
              min={0}
              max={120}
              value={formData.age}
              onChange={handleChange}
            />

            <label>Visit Date</label>
            <input
              type="date"
              name="visitDate"
              required
              value={formData.visitDate}
              onChange={handleChange}
            />

            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />

            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />

            <label>Invited By</label>
            <input
              type="text"
              name="invitedBy"
              placeholder="Member/Family Name"
              value={formData.invitedBy}
              onChange={handleChange}
            />

            <label>Service Attended</label>
            <select
              name="serviceAttended"
              required
              value={formData.serviceAttended}
              onChange={handleChange}
            >
              <option value="">Choose Service</option>
              <option>Sunday Service</option>
              <option>Midweek Service</option>
              <option>Youth Service</option>
              <option>Special Program</option>
            </select>

            <label>How did you find out about the church?</label>
            <select
              name="foundBy"
              required
              value={formData.foundBy}
              onChange={handleChange}
            >
              <option value="">Select Option</option>
              <option>Friend/Family</option>
              <option>Online Search</option>
              <option>Social Media</option>
              <option>Church Event</option>
              <option>Walk-in</option>
            </select>

            <div className="additional-info">
              <label>
                <input
                  type="checkbox"
                  name="firstTime"
                  checked={formData.firstTime}
                  onChange={handleChange}
                />
                &emsp; First-Time Visitor
              </label>

              <label>
                <input
                  type="checkbox"
                  name="needsFollowUp"
                  checked={formData.needsFollowUp}
                  onChange={handleChange}
                />
                &emsp; Needs Follow-Up
              </label>
            </div>

            <div className="form-buttons">
              <button type="submit" className="add-btn">
                Add Visitor
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate("/congregation/visitorRecords")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddVisitorPage;
