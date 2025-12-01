import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

interface Donor {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  donorType: string;
}

const AddDonor: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    document.body.classList.toggle("sidebar-open", sidebarOpen);
  }, [sidebarOpen]);

  const [form, setForm] = useState<Donor>({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
    donorType: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Donor submitted (no DB yet):", form);
    alert("Donor will be submitted to the database once backend is ready.");
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
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

        <h2>DONOR MANAGER</h2>
        <a href="/donor/dashboard">Dashboard</a>
        <a href="/donor/donors" className="active">
          Donors
        </a>
        <a href="/donor/donations">Donations</a>
        <a href="/donor/reports">Reports</a>

        <hr className="sidebar-separator" />
        <a href="/dashboard" className="return-main">
          ← Back to Main Dashboard
        </a>
      </div>

      {/* Page Content */}
      <div className="dashboard-content">
        <header className="page-header">
          <h1>Add Donor</h1>
          <div>
            <button
              className="add-btn"
              style={{ margin: "10px 0" }}
              onClick={() => navigate("/donor/donors")}
            >
              ← Back
            </button>
            <button className="hamburger" onClick={toggleSidebar}>
              &#9776;
            </button>
          </div>
        </header>

        <div className="container">
          <form className="add-form-styling" onSubmit={handleSubmit}>
            {/* FIRST NAME */}
            <label>First Name</label>
            <input
              type="text"
              required
              value={form.firstName}
              onChange={(e) =>
                setForm({ ...form, firstName: e.target.value })
              }
            />

            {/* LAST NAME */}
            <label>Last Name</label>
            <input
              type="text"
              required
              value={form.lastName}
              onChange={(e) =>
                setForm({ ...form, lastName: e.target.value })
              }
            />

            {/* GENDER */}
            <label>Gender</label>
            <select
              required
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>

            {/* EMAIL */}
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            {/* PHONE */}
            <label>Phone</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            {/* ADDRESS */}
            <label>Address</label>
            <textarea
              rows={3}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />

            {/* DONOR TYPE */}
            <label>Donor Type</label>
            <select
              required
              value={form.donorType}
              onChange={(e) =>
                setForm({ ...form, donorType: e.target.value })
              }
            >
              <option value="">Select Donor Type</option>
              <option>Individual</option>
              <option>Organization</option>
              <option>Anonymous</option>
            </select>

            {/* BUTTONS */}
            <div className="form-buttons">
              <button type="submit" className="add-btn">
                Add Donor
              </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate("/donor/donors")}
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

export default AddDonor;
