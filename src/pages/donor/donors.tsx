import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

interface Donor {
  id: number;
  name: string;
  email: string;
  phone: string;
  donor_type_id: number | null;
  donor_type?: string; // optional, fetched from backend
}

const DonorManagementPage: React.FC = () => {
  const navigate = useNavigate();

  // ---------------- Sidebar ----------------
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    if (sidebarOpen) document.body.classList.add("sidebar-open");
    else document.body.classList.remove("sidebar-open");
  }, [sidebarOpen]);

  // ---------------- Donor Data ----------------
  const [donorData, setDonorData] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/donors");
        if (!res.ok) throw new Error("Failed to fetch donors");
        const data = await res.json();

        // Optional: Map donor_type_id to donor_type name if your backend provides it
        const donorsWithType = data.map((d: any) => ({
          ...d,
          donor_type: d.donor_type_id === 1 ? "Individual" : "Organization",
        }));

        setDonorData(donorsWithType);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, []);

  // ---------------- Search ----------------
  const [searchQuery, setSearchQuery] = useState("");
  const filteredDonors = useMemo(() => {
    return donorData.filter(
      (d) =>
        d.name &&
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        d.donor_type !== "Anonymous" // exclude anonymous
    );
  }, [donorData, searchQuery]);

  // ---------------- Grouping ----------------
  const donorGroups = useMemo(() => {
    return filteredDonors.reduce((groups: Record<string, Donor[]>, donor) => {
      if (!groups[donor.donor_type!]) groups[donor.donor_type!] = [];
      groups[donor.donor_type!].push(donor);
      return groups;
    }, {});
  }, [filteredDonors]);

  // ---------------- Modals ----------------
  const [editDonor, setEditDonor] = useState<Donor | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [viewDonor, setViewDonor] = useState<Donor | null>(null);

  const openEditModal = (donor: Donor, index: number) => {
    setEditDonor(donor);
    setEditIndex(index);
  };
  const closeEditModal = () => setEditDonor(null);

  const openViewModal = (donor: Donor) => setViewDonor(donor);
  const closeViewModal = () => setViewDonor(null);

  const saveDonor = async () => {
    if (editDonor && editIndex !== null) {
      try {
        const res = await fetch(`http://localhost:3000/api/donors/${editDonor.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editDonor),
        });
        if (!res.ok) throw new Error("Failed to update donor");

        const updated = [...donorData];
        updated[editIndex] = editDonor;
        setDonorData(updated);
      } catch (err: any) {
        alert(err.message);
      } finally {
        closeEditModal();
      }
    }
  };

  const handleAddDonor = () => navigate("/donor/addDonor");

  // ---------------- Rendering ----------------
  if (loading) return <p>Loading donors...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

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

        <h2>DONOR MGMT</h2>
        <a href="/donor/dashboard">Dashboard</a>
        <a href="/donor/donors" className="active">
          Donors List
        </a>
        <a href="/donor/donations">Donations</a>
        <a href="/donor/donorCategories">Donor Categories</a>
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
        <h1>Donors</h1>
        <br />
        <div
          className="table-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            className="search-input"
            placeholder="Search donors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="add-btn" onClick={handleAddDonor}>
            + Add Donor
          </button>
        </div>

        {/* Donor Groups */}
        {Object.entries(donorGroups).map(([type, donors]) => (
          <div className="department-block" key={type}>
            <h2>{type} Donors</h2>
            <table className="responsive-table">
              <thead>
                <tr>
                  <th>Donor ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {donors.map((d, i) => {
                  const index = donorData.indexOf(d);
                  return (
                    <tr key={d.id}>
                      <td data-title="ID">{d.id}</td>
                      <td data-title="Name">{d.name}</td>
                      <td data-title="Email">{d.email}</td>
                      <td data-title="Phone">{d.phone}</td>
                      <td className="actions">
                        <button className="add-btn" onClick={() => openViewModal(d)}>
                          View
                        </button>
                        <button
                          className="edit-btn"
                          onClick={() => openEditModal(d, index)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}

        {/* Edit Modal */}
        {editDonor && (
          <>
            <div className="overlay" onClick={closeEditModal}></div>
            <div className="filter-popup modal-wide">
              <h3>Edit Donor</h3>
              <label>Name</label>
              <input
                type="text"
                value={editDonor.name}
                onChange={(e) =>
                  setEditDonor({ ...editDonor, name: e.target.value })
                }
              />
              <label>Email</label>
              <input
                type="email"
                value={editDonor.email}
                onChange={(e) =>
                  setEditDonor({ ...editDonor, email: e.target.value })
                }
              />
              <label>Phone</label>
              <input
                type="text"
                value={editDonor.phone}
                onChange={(e) =>
                  setEditDonor({ ...editDonor, phone: e.target.value })
                }
              />
              <div className="filter-popup-buttons">
                <button className="add-btn" onClick={saveDonor}>
                  Save
                </button>
                <button className="delete-btn" onClick={closeEditModal}>
                  Close
                </button>
              </div>
            </div>
          </>
        )}

        {/* View Modal */}
        {viewDonor && (
          <>
            <div className="overlay" onClick={closeViewModal}></div>
            <div className="filter-popup modal-wide">
              <h3>Donor Details</h3>
              <table className="responsive-table view-table">
                <tbody>
                  <tr>
                    <td>Donor ID</td>
                    <td>{viewDonor.id}</td>
                  </tr>
                  <tr>
                    <td>Name</td>
                    <td>{viewDonor.name}</td>
                  </tr>
                  <tr>
                    <td>Email</td>
                    <td>{viewDonor.email}</td>
                  </tr>
                  <tr>
                    <td>Phone</td>
                    <td>{viewDonor.phone}</td>
                  </tr>
                  <tr>
                    <td>Type</td>
                    <td>{viewDonor.donor_type}</td>
                  </tr>
                </tbody>
              </table>
              <div className="filter-popup-buttons">
                <button className="delete-btn" onClick={closeViewModal}>
                  Close
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DonorManagementPage;
