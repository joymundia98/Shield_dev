import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

interface MemberForm {
  photo: string;
  name: string;
  category: string;
  age: number | "";
  gender: "Male" | "Female" | "";
  joinDate: string;
  address: string;
  phone: string;
  email: string;
  disabled: boolean;
  orphan: boolean;
  widowed: boolean;
  NRC?: string;
  guardianName?: string;
  guardianPhone?: string;
}

const AddMemberPage: React.FC = () => {
  const navigate = useNavigate();

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Form state
  const [formData, setFormData] = useState<MemberForm>({
    photo: "",
    name: "",
    category: "",
    age: "",
    gender: "",
    joinDate: "",
    address: "",
    phone: "",
    email: "",
    disabled: false,
    orphan: false,
    widowed: false,
    NRC: "",
    guardianName: "",
    guardianPhone: "",
  });

  // Show adult or minor fields
  const [isAdult, setIsAdult] = useState<boolean | null>(null);

  useEffect(() => {
    if (formData.age !== "" && formData.age >= 18) setIsAdult(true);
    else if (formData.age !== "" && formData.age < 18) setIsAdult(false);
    else setIsAdult(null);
  }, [formData.age]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New Member Data:", formData);
    alert("Member added successfully (check console for data).");
    // TODO: Send formData to backend via POST request
  };

  return (
    <div className="dashboard-wrapper" style={{ display: "flex" }}>
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="close-wrapper">
          <div className="toggle close-btn">
            <input
              type="checkbox"
              checked={sidebarOpen}
              onChange={() => setSidebarOpen(false)}
            />
            <span className="button"></span>
            <span className="label">X</span>
          </div>
        </div>
        <h2>CONGREGATION</h2>
        <a href="/congregation/dashboard">Dashboard</a>
        <a href="/congregation/members" className="active">
          Members Records
        </a>
        <a href="/congregation/families">Families</a>
        <a href="/congregation/attendance">Attendance</a>
        <a href="/congregation/followups">Follow-ups</a>
        <a href="/congregation/reports">Reports</a>
        <a href="/congregation/settings">Settings</a>
        <hr className="sidebar-separator" />
        <a href="/dashboard">← Back to Main Dashboard</a>
        <a href="/" onClick={() => { localStorage.clear(); navigate("/"); }}>Logout</a>
      </div>

      {/* Main Content */}
      <div className="dashboard-content" style={{ flex: 1, padding: "1rem", minWidth: 0 }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>Add New Member</h1>
          <div>
            <button className="add-btn" onClick={() => navigate("/congregation/members")}>
              ← Member Records
            </button>
            <button className="add-btn" onClick={() => navigate("/congregation/members")}>
              ← Members Overview
            </button>
            <button className="hamburger" onClick={toggleSidebar}>&#9776;</button>
          </div>
        </header>

        <div className="FormContainer" style={{ marginTop: "1rem" }}>
          <form onSubmit={handleSubmit}>
            <label>Photo</label>
            <input
              type="text"
              placeholder="Photo URL"
              name="photo"
              value={formData.photo}
              onChange={handleChange}
            />

            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="">Select Category</option>
              <option>Adult</option>
              <option>Youth</option>
              <option>Child</option>
              <option>Widow/Widower</option>
              <option>Orphan</option>
            </select>

            <label>Age</label>
            <input
              type="number"
              name="age"
              min={0}
              max={120}
              value={formData.age}
              onChange={handleChange}
              required
            />

            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>

            <label>Join Date</label>
            <input
              type="date"
              name="joinDate"
              value={formData.joinDate}
              onChange={handleChange}
              required
            />

            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />

            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            {/* Additional Info */}
            <div className="additional-info">
              <label>
                <input type="checkbox" name="disabled" checked={formData.disabled} onChange={handleChange} /> Disabled
              </label>
              <label>
                <input type="checkbox" name="orphan" checked={formData.orphan} onChange={handleChange} /> Orphan
              </label>
              <label>
                <input type="checkbox" name="widowed" checked={formData.widowed} onChange={handleChange} /> Widowed (if Female)
              </label>
            </div>

            {/* Conditional fields */}
            {isAdult ? (
              <div>
                <label>NRC</label>
                <input type="text" name="NRC" value={formData.NRC} onChange={handleChange} />
              </div>
            ) : isAdult === false ? (
              <div>
                <label>Guardian Name</label>
                <input type="text" name="guardianName" value={formData.guardianName} onChange={handleChange} />
                <label>Guardian Phone</label>
                <input type="text" name="guardianPhone" value={formData.guardianPhone} onChange={handleChange} />
              </div>
            ) : null}

            <div className="form-buttons" style={{ marginTop: "1rem" }}>
              <button type="submit" className="add-btn">Add Member</button>
              <button type="button" className="cancel-btn" onClick={() => navigate("/congregation/members")}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMemberPage;
