import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

interface Department {
  id: number;
  name: string;
  desc: string;
  total: number;
}

const DepartmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* -------------------- Department States -------------------- */
  const [churchDepartments, setChurchDepartments] = useState<Department[]>([
    { id: 1, name: "Ushering", desc: "Greeters and sanctuary order maintainers", total: 28 },
    { id: 2, name: "Choir", desc: "Worship and praise team", total: 45 },
    { id: 3, name: "Media", desc: "Audio, video, livestream team", total: 17 },
    { id: 4, name: "Intercessory", desc: "Prayer and spiritual support team", total: 22 }
  ]);

  const [corporateDepartments, setCorporateDepartments] = useState<Department[]>([
    { id: 1, name: "Accounting", desc: "Financial records and reporting", total: 6 },
    { id: 2, name: "Human Resources", desc: "Staff management & HR policies", total: 4 },
    { id: 3, name: "IT & Systems", desc: "Technical and software management", total: 3 },
    { id: 4, name: "Administration", desc: "General admin & documentation", total: 5 }
  ]);

  /* -------------------- Popup States -------------------- */
  const [showPopup, setShowPopup] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editingGroup, setEditingGroup] = useState<"church" | "corporate" | null>(null);

  const [deptName, setDeptName] = useState("");
  const [deptDesc, setDeptDesc] = useState("");

  /* -------------------- Sidebar -------------------- */
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    if (sidebarOpen) document.body.classList.add("sidebar-open");
    else document.body.classList.remove("sidebar-open");
  }, [sidebarOpen]);

  /* -------------------- Popup Logic -------------------- */
  const openPopup = (group: "church" | "corporate", index: number | null = null) => {
    setEditingGroup(group);
    setEditIndex(index);

    if (index !== null) {
      const dept = group === "church" ? churchDepartments[index] : corporateDepartments[index];
      setDeptName(dept.name);
      setDeptDesc(dept.desc);
    } else {
      setDeptName("");
      setDeptDesc("");
    }

    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setEditIndex(null);
    setEditingGroup(null);
  };

  /* -------------------- Save Handler -------------------- */
  const saveDepartment = () => {
    if (!deptName.trim()) {
      alert("Department name is required");
      return;
    }

    if (!editingGroup) return;

    if (editIndex !== null) {
      // Editing existing
      if (editingGroup === "church") {
        const updated = [...churchDepartments];
        updated[editIndex] = { ...updated[editIndex], name: deptName, desc: deptDesc };
        setChurchDepartments(updated);
      } else {
        const updated = [...corporateDepartments];
        updated[editIndex] = { ...updated[editIndex], name: deptName, desc: deptDesc };
        setCorporateDepartments(updated);
      }
    } else {
      // Creating new department
      const newDept: Department = {
        id:
          editingGroup === "church"
            ? churchDepartments.length + 1
            : corporateDepartments.length + 1,
        name: deptName,
        desc: deptDesc,
        total: 0
      };

      if (editingGroup === "church") {
        setChurchDepartments(prev => [...prev, newDept]);
      } else {
        setCorporateDepartments(prev => [...prev, newDept]);
      }
    }

    closePopup();
  };

  /* -------------------- Delete Handler -------------------- */
  const deleteDepartment = (group: "church" | "corporate", index: number) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;

    if (group === "church") {
      setChurchDepartments(prev => prev.filter((_, i) => i !== index));
    } else {
      setCorporateDepartments(prev => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="dashboard-wrapper">

      {/* Hamburger */}
      <button className="hamburger" onClick={toggleSidebar}>
        &#9776;
      </button>

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

        <h2>HR MANAGER</h2>
        <a href="/hr/dashboard">Dashboard</a>
        <a href="/hr/staff" className="active">Staff Directory</a>
        <a href="/hr/attendance">Attendance</a>
        <a href="/hr/leave">Leave Management</a>
        <a href="/hr/departments" className="active">Departments</a>
        {/*<a href="#">Volunteers</a>
        <a href="#">Training</a>
        <a href="#">HR Documents</a>*/}

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

        {/* Church Departments */}
        <div className="table-section">
          <div className="table-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2>Church Departments</h2>
            <button className="add-btn" onClick={() => openPopup("church")}>
              + &nbsp; Add Church Department
            </button>
          </div>

          <table className="responsive-table">
            <thead>
              <tr>
                <th>Department ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Total Members</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {churchDepartments.map((dept, index) => (
                <tr key={dept.id}>
                  <td>{dept.id}</td>
                  <td>{dept.name}</td>
                  <td>{dept.desc}</td>
                  <td>{dept.total}</td>
                  <td className="actions">
                    <button className="edit-btn" onClick={() => openPopup("church", index)}>Edit</button>
                    <button className="delete-btn" onClick={() => deleteDepartment("church", index)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Corporate Departments */}
        <div className="table-section" style={{ marginTop: "3rem" }}>
          <div className="table-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2>Corporate Departments</h2>
            <button className="add-btn" onClick={() => openPopup("corporate")}>
              + &nbsp; Add Corporate Department
            </button>
          </div>

          <table className="responsive-table">
            <thead>
              <tr>
                <th>Department ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Total Staff</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {corporateDepartments.map((dept, index) => (
                <tr key={dept.id}>
                  <td>{dept.id}</td>
                  <td>{dept.name}</td>
                  <td>{dept.desc}</td>
                  <td>{dept.total}</td>
                  <td className="actions">
                    <button className="edit-btn" onClick={() => openPopup("corporate", index)}>Edit</button>
                    <button className="delete-btn" onClick={() => deleteDepartment("corporate", index)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Popup Overlay */}
      {showPopup && <div className="overlay" onClick={closePopup}></div>}

      {/* Popup Form */}
      <div className="filter-popup" style={{ display: showPopup ? "block" : "none", width: "380px", padding: "2rem" }}>
        <h3>{editIndex !== null ? "Edit Department" : "Add Department"}</h3>

        <label>Name</label>
        <input
          type="text"
          value={deptName}
          onChange={(e) => setDeptName(e.target.value)}
          placeholder="Department Name"
        />

        <label>Description</label>
        <textarea
          value={deptDesc}
          onChange={(e) => setDeptDesc(e.target.value)}
          placeholder="Short description"
        ></textarea>

        <div className="filter-popup-buttons" style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <button className="add-btn" onClick={saveDepartment}>Save</button>
          <button className="cancel-btn" onClick={closePopup}>Cancel</button>
        </div>
      </div>

    </div>
  );
};

export default DepartmentsPage;
