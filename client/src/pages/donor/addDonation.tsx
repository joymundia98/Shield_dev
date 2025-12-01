import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

interface Donation {
  donorName: string;
  registered: string;
  date: string;
  amount: number | null;
  type: string;
  method: string;
}

const AddDonation: React.FC = () => {
  const navigate = useNavigate();

  // Explicitly type boolean state to fix JSX template string issues
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    document.body.classList.toggle("sidebar-open", sidebarOpen);
  }, [sidebarOpen]);

  const [form, setForm] = useState<Donation>({
    donorName: "",
    registered: "",
    date: "",
    amount: null,
    type: "",
    method: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Donation submitted (static values for now):", form);
    alert("Donation will be submitted to the database once backend is ready.");
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
        <a href="/donor/donors">Donors List</a>
        <a href="/donor/donations" className="active">Donations</a>
        <a href="/donor/donorCategories">Donor Categories</a>

        <hr className="sidebar-separator" />
        <a href="/dashboard" className="return-main">
          ← Back to Main Dashboard
        </a>
      </div>

      {/* Page Content */}
      <div className="dashboard-content">
        <header className="page-header">
          <h1>Add Donation</h1>
          <button
              className="add-btn"
              style={{ margin: "10px 0" }}
              onClick={() => navigate("/donor/donations")}
            >
              ← Back
            </button>
          <div>
            <button
              className="hamburger"
              onClick={toggleSidebar}
              style={{ marginLeft: "10px" }}
            >
              &#9776;
            </button>
          </div>
        </header>

        <div className="container">
          <form className="add-form-styling" onSubmit={handleSubmit}>
            {/* DONOR NAME */}
            <label>Donor Name</label>
            <input
              type="text"
              required
              value={form.donorName}
              onChange={(e) =>
                setForm({ ...form, donorName: e.target.value })
              }
              placeholder="Enter donor name"
            />

            {/* REGISTERED */}
            <label>Registered Donor?</label>
            <select
              required
              value={form.registered}
              onChange={(e) =>
                setForm({ ...form, registered: e.target.value })
              }
            >
              <option value="">Select</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>

            {/* DATE */}
            <label>Donation Date</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />

            {/* AMOUNT */}
            <label>Amount ($)</label>
            <input
              type="number"
              required
              value={form.amount ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  amount: e.target.value ? Number(e.target.value) : null,
                })
              }
              placeholder="Enter amount"
            />

            {/* DONATION TYPE */}
            <label>Donation Type</label>
            <select
              required
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="">Select Donation Type</option>
              <option>Widows Contributions</option>
              <option>Special Fund</option>
              <option>Disaster Relief</option>
              <option>Other</option>
            </select>

            {/* PAYMENT METHOD */}
            <label>Payment Method</label>
            <select
              required
              value={form.method}
              onChange={(e) => setForm({ ...form, method: e.target.value })}
            >
              <option value="">Select Payment Method</option>
              <option>Cash</option>
              <option>Bank Transfer</option>
              <option>Mobile Money</option>
              <option>Check</option>
            </select>

            {/* BUTTONS */}
            <div className="form-buttons">
              <button type="submit" className="add-btn">
                Add Donation
              </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate("/donor/donations")}
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

export default AddDonation;
