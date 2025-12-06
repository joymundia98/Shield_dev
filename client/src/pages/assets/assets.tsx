import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

// Interfaces for Asset, Category, and Location
interface Asset {
  asset_id: number;
  name: string;
  category_id: number;
  location_id: number;
  department_id: number;
  acquisition_date: string;
  purchase_cost: string;
  current_value: string;
  condition_status: string;
  status: string;
  serial_number: string;
  description: string;
  latitude: string | null;
  longitude: string | null;
  created_at: string;
}

interface Category {
  category_id: number;
  name: string;
}

interface Location {
  location_id: number;
  name: string;
}

const AssetsPage: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inventory, setInventory] = useState<Asset[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // Categories data
  const [locations, setLocations] = useState<Location[]>([]); // Locations data
  const [filter, setFilter] = useState({
    condition: "",
    category: "",
    maintenance: ""
  });

  // Fetch assets, categories, and locations on component mount
  useEffect(() => {
    const fetchAssets = async () => {
      const response = await fetch("http://localhost:3000/api/assets");
      const data: Asset[] = await response.json();
      setInventory(data);
    };

    const fetchCategories = async () => {
      const response = await fetch("http://localhost:3000/api/asset_categories");
      const data: Category[] = await response.json();
      setCategories(data);
    };

    const fetchLocations = async () => {
      const response = await fetch("http://localhost:3000/api/locations");
      const data: Location[] = await response.json();
      setLocations(data);
    };

    fetchAssets();
    fetchCategories();
    fetchLocations();
  }, []);

  const groupByCategory = (assets: Asset[]) => {
    return assets.reduce((acc: Record<string, Asset[]>, asset) => {
      const category = asset.category_id.toString(); // Group by category_id
      if (!acc[category]) acc[category] = [];
      acc[category].push(asset);
      return acc;
    }, {});
  };

  const groupedAssets = useMemo(() => groupByCategory(inventory), [inventory]);

  // Action Handlers
  const handleAdd = () => {
    navigate("/assets/addAsset", { state: { addAssetCallback: setInventory } });
  };

  const handleEdit = (id: string) => navigate(`/assets/edit/${id}`);
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this asset?")) {
      setInventory(prev => prev.filter(a => a.asset_id !== id));
    }
  };

  const handleView = (id: string) => {
    navigate(`/assets/view/${id}`);
  };

  // Helper function to get location name by location_id
  const getLocationName = (locationId: number) => {
    const location = locations.find(loc => loc.location_id === locationId);
    return location ? location.name : "Unknown Location";
  };

  // Helper function to get category name by category_id
  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.category_id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
        &#9776;
      </button>

      <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`} id="sidebar">
        <div className="close-wrapper">
          <div className="toggle close-btn">
            <input
              type="checkbox"
              id="closeSidebarButton"
              checked={sidebarOpen}
              onChange={() => setSidebarOpen(!sidebarOpen)}
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
          <button className="filter-btn" onClick={() => setFilter({ ...filter })}>&#x1F5D1; Filter</button>
        </div>

        {/* Asset Tables Grouped by Category */}
        {Object.keys(groupedAssets).map(categoryId => {
          const categoryName = getCategoryName(Number(categoryId));
          return (
            <div key={categoryId}>
              <h2>{categoryName}</h2> {/* Category Header */}
              <table className="responsive-table">
                <thead>
                  <tr>
                    <th>Asset ID</th>
                    <th>Asset Name</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Condition</th>
                    <th>Status</th> {/* Status column comes before Maintenance */}
                    <th>Current Value ($)</th>
                    <th>Assigned To</th>
                    <th>Actions</th> {/* Removed Under Maintenance column */}
                  </tr>
                </thead>
                <tbody>
                  {groupedAssets[categoryId].map(asset => (
                    <tr key={asset.asset_id}>
                      <td data-title="Asset ID">{asset.asset_id}</td>
                      <td data-title="Asset Name">{asset.name}</td>
                      <td data-title="Category">{categoryName}</td>
                      <td data-title="Location">{getLocationName(asset.location_id)}</td>
                      <td data-title="Condition">{asset.condition_status}</td>
                      <td data-title="Status">{asset.status}</td>
                      <td data-title="Current Value ($)">{parseFloat(asset.current_value).toFixed(2)}</td>
                      <td data-title="Assigned To">{asset.department_id}</td> {/* Assuming department_id can be mapped to department */}
                      <td className="actions" data-title="Actions">
                        <button className="edit-btn" onClick={() => handleEdit(asset.asset_id.toString())}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDelete(asset.asset_id.toString())}>Delete</button>
                        <button className="view-btn" onClick={() => handleView(asset.asset_id.toString())}>View</button> {/* View button */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}

        {/* Filter Popup and Other UI Elements */}
        {/* The code for filter popup and other UI components remains the same */}
      </div>
    </div>
  );
};

export default AssetsPage;
