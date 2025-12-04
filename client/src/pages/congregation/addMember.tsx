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

const BACKEND_URL = "http://localhost:3000/api/members";

const AddMemberPage: React.FC = () => {
  const navigate = useNavigate();

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    sidebarOpen
      ? document.body.classList.add("sidebar-open")
      : document.body.classList.remove("sidebar-open");
    return () => document.body.classList.remove("sidebar-open");
  }, [sidebarOpen]);

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

  const [isAdult, setIsAdult] = useState<boolean | null>(null);

  useEffect(() => {
    if (formData.age !== "" && formData.age >= 18) setIsAdult(true);
    else if (formData.age !== "" && formData.age < 18) setIsAdult(false);
    else setIsAdult(null);
  }, [formData.age]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));
  };

  // --- Backend submission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Map frontend fields to backend-required fields
    const payload: Record<string, any> = {
      photo: formData.photo || null,
      full_name: formData.name || null, // backend expects "full_name"
      category: formData.category || null,
      age: formData.age !== "" ? Number(formData.age) : null,
      gender: formData.gender || null,
      join_date: formData.joinDate || null, // backend expects "join_date"
      address: formData.address || null,
      phone: formData.phone || null,
      email: formData.email || null,
      disabled: Boolean(formData.disabled),
      orphan: Boolean(formData.orphan),
      widowed: Boolean(formData.widowed),
    };

    // Optional adult/minor fields
    if (isAdult) {
      payload.nrc = formData.NRC || null;
    } else if (isAdult === false) {
      payload.guardian_name = formData.guardianName || null;
      payload.guardian_phone = formData.guardianPhone || null;
    }

    // DEBUG: log the payload before sending
    console.log("Submitting Member Payload:", JSON.stringify(payload, null, 2));

    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: "Unknown error" }));
        alert("Error: " + error.message);
        return;
      }

      alert("Member added successfully!");
      navigate("/congregation/members"); // redirect to members overview
    } catch (err) {
      console.error("Failed to submit member:", err);
      alert("Server error. Check console for details.");
    }
  };

  return (
    <div className="dashboard-wrapper members-wrapper">
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
        <a href="/congregation/members" className="active">Members</a>
        <a href="/congregation/attendance">Attendance</a>
        <a href="/congregation/followups">Follow-ups</a>
        <a href="/congregation/visitors">Visitors</a>
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
          <h1>Add New Member</h1>
          <div className="header-buttons">
            <br/>
            <button className="add-btn" onClick={() => navigate("/congregation/memberRecords")}>
              ← Member Records
            </button>&nbsp;&nbsp;
            <button className="add-btn" onClick={() => navigate("/congregation/members")}>
              ← Members Overview
            </button>
          </div>
        </header>

        <div className="FormContainer">
          <form onSubmit={handleSubmit}>
            <label>Photo</label>
            <input type="text" placeholder="Photo URL" name="photo" value={formData.photo} onChange={handleChange} />

            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />

            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="">Select Category</option>
              <option>Adult</option>
              <option>Youth</option>
              <option>Child</option>
              <option>Elderly</option>
            </select>

            <label>Age</label>
            <input type="number" name="age" min={0} max={120} value={formData.age} onChange={handleChange} required />

            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>

            <label>Join Date</label>
            <input type="date" name="joinDate" value={formData.joinDate} onChange={handleChange} required />

            <label>Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} required />

            <label>Phone</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />

            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />

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

            <div className="form-buttons">
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
