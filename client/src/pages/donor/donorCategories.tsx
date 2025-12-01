import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

interface DonorType {
  name: string;
  subcategories: string[];
}

const DonorCategoriesPage: React.FC = () => {
  const navigate = useNavigate();

  /* -------------------- Sidebar -------------------- */
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    document.body.classList.toggle("sidebar-open", sidebarOpen);
  }, [sidebarOpen]);

  /* -------------------- Donor Types -------------------- */
  const [donorTypes, setDonorTypes] = useState<DonorType[]>([
    { name: "Individual", subcategories: ["Regular", "Occasional", "One-time"] },
    { name: "Corporate", subcategories: ["Silver", "Gold", "Platinum"] },
  ]);

  /* -------------------- Popup States -------------------- */
  const [showPopup, setShowPopup] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [typeName, setTypeName] = useState("");
  const [subcategories, setSubcategories] = useState<string[]>([]);

  /* -------------------- Popup Handlers -------------------- */
  const openPopup = (index: number | null = null) => {
    setEditIndex(index);
    if (index !== null) {
      setTypeName(donorTypes[index].name);
      setSubcategories([...donorTypes[index].subcategories]);
    } else {
      setTypeName("");
      setSubcategories([]);
    }
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setEditIndex(null);
    setTypeName("");
    setSubcategories([]);
  };

  const updateSubcategory = (idx: number, value: string) => {
    const updated = [...subcategories];
    updated[idx] = value;
    setSubcategories(updated);
  };

  const addSubcategory = (value: string = "") => {
    setSubcategories([...subcategories, value]);
  };

  const deleteSubcategory = (idx: number) => {
    setSubcategories(subcategories.filter((_, i) => i !== idx));
  };

  const saveDonorType = () => {
    if (!typeName.trim()) {
      alert("Type name is required");
      return;
    }
    if (subcategories.filter((s) => s.trim() !== "").length === 0) {
      alert("Add at least one subcategory");
      return;
    }

    const newDonorType: DonorType = {
      name: typeName,
      subcategories: subcategories.filter((s) => s.trim() !== ""),
    };

    if (editIndex !== null) {
      const updated = [...donorTypes];
      updated[editIndex] = newDonorType;
      setDonorTypes(updated);
    } else {
      setDonorTypes([...donorTypes, newDonorType]);
    }

    closePopup();
  };

  const deleteDonorType = (index: number) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    setDonorTypes(donorTypes.filter((_, i) => i !== index));
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="close-wrapper">
          <div className="toggle close-btn">
            <input type="checkbox" checked={sidebarOpen} onChange={toggleSidebar} />
            <span className="button"></span>
            <span className="label">X</span>
          </div>
        </div>

        <h2>DONOR MANAGEMENT</h2>
        <a href="/donor/dashboard">Dashboard</a>
        <a href="/donor/donors">Donors</a>
        <a href="/donor/donations">Donations</a>
        <a href="/donor/categories" className="active">
          Donor Categories
        </a>

        <hr className="sidebar-separator" />
        <a href="/dashboard" className="return-main">
          ← Back to Main Dashboard
        </a>
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
        <header className="page-header income-header">
          <h1>Donor Categories</h1>
          <button className="hamburger" onClick={toggleSidebar}>
            &#9776;
          </button>
        </header>

        <div className="container">
          <div className="table-section">
            <div
              className="table-header"
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <h2>Donor Types</h2>
              <button className="add-btn" onClick={() => openPopup()}>
                + Add Donor Type
              </button>
            </div>

            <table className="responsive-table">
              <thead>
                <tr>
                  <th>Type Name</th>
                  <th>Subcategories</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {donorTypes.map((type, index) => (
                  <tr key={index}>
                    <td>{type.name}</td>
                    <td>{type.subcategories.join(", ")}</td>
                    <td className="actions">
                      <button className="edit-btn" onClick={() => openPopup(index)}>
                        Edit
                      </button>
                      <button className="delete-btn" onClick={() => deleteDonorType(index)}>
                        Delete
                      </button>
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
        <div
          className="filter-popup"
          style={{ display: showPopup ? "block" : "none", width: "380px", padding: "2rem" }}
        >
          <h3>{editIndex !== null ? "Edit Donor Type" : "Add Donor Type"}</h3>

          <label>Type Name</label>
          <input
            type="text"
            value={typeName}
            onChange={(e) => setTypeName(e.target.value)}
            placeholder="Enter Name"
          />

          <label>Subcategories</label>
          {subcategories.map((sub, idx) => (
            <div className="subcategory-row" key={idx}>
              <input
                type="text"
                value={sub}
                onChange={(e) => updateSubcategory(idx, e.target.value)}
              />
              <button type="button" onClick={() => deleteSubcategory(idx)}>
                Delete
              </button>
            </div>
          ))}

          <button
            type="button"
            className="add-btn"
            onClick={() => addSubcategory()}
            style={{ marginTop: "0.5rem" }}
          >
            + Add another subcategory
          </button>

          <div
            className="filter-popup-buttons"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <button className="add-btn" onClick={saveDonorType}>
              Save
            </button>
            <button className="cancel-btn" onClick={closePopup}>
              Cancel
            </button>
            {editIndex !== null && (
              <button
                className="delete-btn"
                onClick={() => {
                  deleteDonorType(editIndex);
                  closePopup();
                }}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorCategoriesPage;
