import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

interface Asset {
  id: string;
  name: string;
  category: string;
  location: string;
  condition: string;
  assignedTo: string;
  initialValue: number;
  currentValue: number;
  depreciationRate: number;
  underMaintenance: boolean;
}

const AssetsPage: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [inventory, setInventory] = useState<Asset[]>([
    { id: "001", name: "Projector X1", category: "Electronics", location: "Main Hall", condition: "Good", assignedTo: "Media Team", initialValue: 1500, currentValue: 1200, depreciationRate: 20, underMaintenance: false },
    { id: "002", name: "Chair A1", category: "Furniture", location: "Conference Room", condition: "Fair", assignedTo: "Admin Team", initialValue: 100, currentValue: 70, depreciationRate: 30, underMaintenance: true },
    { id: "003", name: "Laptop L5", category: "Electronics", location: "IT Office", condition: "Good", assignedTo: "IT Team", initialValue: 2000, currentValue: 1600, depreciationRate: 20, underMaintenance: false },
  ]);

  // ------------------- Filters -------------------
  const [filter, setFilter] = useState({
    condition: "",
    category: "",
    maintenance: ""
  });

  const [tempFilter, setTempFilter] = useState(filter);
  const [showFilterPopup, setShowFilterPopup] = useState(false);

  const openFilter = () => {
    setTempFilter(filter); // Reset popup selections to applied filter
    setShowFilterPopup(true);
  };
  const closeFilter = () => setShowFilterPopup(false);
  const handleApplyFilter = () => {
    setFilter(tempFilter);
    closeFilter();
  };
  const handleClearFilter = () => {
    setFilter({ condition: "", category: "", maintenance: "" });
    setTempFilter({ condition: "", category: "", maintenance: "" });
    closeFilter();
  };

  // ------------------- Sidebar -------------------
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    if (sidebarOpen) document.body.classList.add("sidebar-open");
    else document.body.classList.remove("sidebar-open");
  }, [sidebarOpen]);

  // ------------------- Filtered Inventory -------------------
  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      if (filter.condition && item.condition !== filter.condition) return false;
      if (filter.category && item.category !== filter.category) return false;
      if (filter.maintenance) {
        if (filter.maintenance === "Yes" && !item.underMaintenance) return false;
        if (filter.maintenance === "No" && item.underMaintenance) return false;
      }
      return true;
    });
  }, [inventory, filter]);

  // ------------------- Handlers -------------------
  const handleAdd = () => navigate("/assets/add");
  const handleEdit = (id: string) => navigate(`/assets/edit/${id}`);
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this asset?")) {
      setInventory(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <div className="dashboard-wrapper">
      {/* Hamburger */}
      <button className="hamburger" onClick={toggleSidebar}>
        &#9776;
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`} id="sidebar">
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

        <h2>ASSET MANAGER</h2>
        <a href="/assets/dashboard">Dashboard</a>
        <a href="/assets/assets" className="active">Asset Inventory</a>
        <a href="/assets/depreciation">Depreciation Info</a>
        <a href="/assets/maintenance">Maintenance</a>
        <a href="/assets/categories">Categories</a>

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
          ➜] Logout
        </a>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        <h1>Asset Inventory</h1>

        {/* Add + Filter Buttons */}
        <div className="table-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button className="add-btn" onClick={handleAdd}>+ &nbsp; Add New Asset</button>
          <button className="filter-btn" onClick={openFilter}>&#x1F5D1; Filter</button>
        </div>

        {/* Asset Table */}
        <table className="responsive-table">
          <thead>
            <tr>
              <th>Asset ID</th>
              <th>Asset Name</th>
              <th>Category</th>
              <th>Location</th>
              <th>Condition</th>
              <th>Current Value ($)</th>
              <th>Assigned To</th>
              <th>Under Maintenance?</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map(asset => (
              <tr key={asset.id}>
                <td data-title="Asset ID">{asset.id}</td>
                <td data-title="Asset Name">{asset.name}</td>
                <td data-title="Category">{asset.category}</td>
                <td data-title="Location">{asset.location}</td>
                <td data-title="Condition">{asset.condition}</td>
                <td data-title="Current Value ($)">{asset.currentValue.toFixed(2)}</td>
                <td data-title="Assigned To">{asset.assignedTo}</td>
                <td data-title="Under Maintenance?">{asset.underMaintenance ? "Yes" : "No"}</td>
                <td className="actions" data-title="Actions">
                  <button className="edit-btn" onClick={() => handleEdit(asset.id)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(asset.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Filter Popup */}
        <div className="overlay" style={{ display: showFilterPopup ? "block" : "none" }} onClick={closeFilter}></div>
        <div className="filter-popup" style={{ display: showFilterPopup ? "block" : "none" }}>
          <h3>Filter Assets</h3>
          <label>
            Condition:
            <select value={tempFilter.condition} onChange={(e) => setTempFilter(prev => ({ ...prev, condition: e.target.value }))}>
              <option value="">All</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </label>
          <label>
            Category:
            <select value={tempFilter.category} onChange={(e) => setTempFilter(prev => ({ ...prev, category: e.target.value }))}>
              <option value="">All</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Stationery">Stationery</option>
            </select>
          </label>
          <label>
            Under Maintenance:
            <select value={tempFilter.maintenance} onChange={(e) => setTempFilter(prev => ({ ...prev, maintenance: e.target.value }))}>
              <option value="">All</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </label>
          <div className="filter-popup-buttons">
            <button className="add-btn" onClick={handleApplyFilter}>Apply Filter</button>
            <button className="delete-btn" onClick={handleClearFilter}>Clear All</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetsPage;
