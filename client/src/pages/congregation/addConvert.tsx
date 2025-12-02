import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

const AddConvert: React.FC = () => {
  const navigate = useNavigate();

  // Sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [convertType, setConvertType] = useState<"visitor" | "member" | "">("");
  const [selectedVisitor, setSelectedVisitor] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  const [convertDate, setConvertDate] = useState("");

  /* ---------------- SIDEBAR EFFECT ---------------- */
  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add("sidebar-open");
    } else {
      document.body.classList.remove("sidebar-open");
    }

    return () => document.body.classList.remove("sidebar-open");
  }, [sidebarOpen]);

  /* ---------------- FORM SUBMIT ---------------- */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      type: convertType,
      name: convertType === "visitor" ? selectedVisitor : selectedMember,
      convertDate,
    };

    console.log("New Convert Data:", data);
    alert("Convert added successfully (check console).");

    // backend save would go here
  };

  return (
    <div className="dashboard-wrapper converts-wrapper">
      {/* HEADER */}
      <header>
        <h1>Add New Convert</h1>

        <div style={{ marginTop: 10 }}>
          <button
            className="add-btn"
            onClick={() => navigate("/congregation/convertRecords")}
          >
            ← Convert Records
          </button>&emsp;

          <button
            className="add-btn"
            onClick={() => navigate("/congregation/converts")}
          >
            ← Converts Overview
          </button>

          <button className="hamburger" onClick={toggleSidebar}>
            &#9776;
          </button>
        </div>
      </header>

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
        <a href="/congregation/attendance">Attendance</a>
        <a href="/congregation/followups">Follow-ups</a>
        <a href="/congregation/visitors">Visitors</a>
        <a href="/congregation/converts" className="active">New Converts</a>

        <hr className="sidebar-separator" />

        <a href="/dashboard">← Back to Main Dashboard</a>
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            localStorage.clear();
            navigate("/");
          }}
        >
          Logout
        </a>
      </div>

      {/* MAIN FORM */}
      <div className="FormContainer">
        <form id="addConvertForm" onSubmit={handleSubmit}>
          {/* Convert Type */}
          <label>Convert Type</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="convertType"
                value="visitor"
                onChange={() => setConvertType("visitor")}
                required
              />
              Visitor
            </label>&emsp;&emsp;

            <label>
              <input
                type="radio"
                name="convertType"
                value="member"
                onChange={() => setConvertType("member")}
              />
              Member
            </label>
          </div>

          {/* Visitor select */}
          {convertType === "visitor" && (
            <div>
              <label>Select Visitor</label>
              <select
                value={selectedVisitor}
                onChange={(e) => setSelectedVisitor(e.target.value)}
              >
                <option value="">--Select Visitor--</option>
                <option>John Doe</option>
                <option>Jane Smith</option>
              </select>
            </div>
          )}

          {/* Member select */}
          {convertType === "member" && (
            <div>
              <label>Select Member</label>
              <select
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
              >
                <option value="">--Select Member--</option>
                <option>Michael Johnson</option>
                <option>Mary Williams</option>
              </select>
            </div>
          )}

          {/* Date */}
          <label>Convert Date</label>
          <input
            type="date"
            required
            value={convertDate}
            onChange={(e) => setConvertDate(e.target.value)}
          />

          {/* Buttons */}
          <div className="form-buttons">
            <button type="submit" className="add-btn">
              Add Convert
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/congregation/convertRecords")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddConvert;
