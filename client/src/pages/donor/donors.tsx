import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

interface Donor {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: "Individual" | "Organization" | "Anonymous";
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

  // ---------------- Static Donor Data (temporary) ----------------
  const [donorData, setDonorData] = useState<Donor[]>([
    {
      id: "D001",
      name: "John Doe",
      email: "john@example.com",
      phone: "+123456789",
      type: "Individual",
    },
    {
      id: "D002",
      name: "Acme Corp.",
      email: "contact@acme.org",
      phone: "+987654321",
      type: "Organization",
    },
    {
      id: "D003",
      name: "Anonymous Donor",
      email: "N/A",
      phone: "N/A",
      type: "Anonymous",
    },
  ]);

  // ---------------- Search ----------------
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDonors = useMemo(() => {
    return donorData.filter((d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [donorData, searchQuery]);

  // ---------------- Grouping ----------------
  const donorGroups = useMemo(() => {
    return filteredDonors.reduce((groups: Record<string, Donor[]>, donor) => {
      if (!groups[donor.type]) groups[donor.type] = [];
      groups[donor.type].push(donor);
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

  const saveDonor = () => {
    if (editDonor && editIndex !== null) {
      const updated = [...donorData];
      updated[editIndex] = editDonor;
      setDonorData(updated);
    }
    closeEditModal();
  };

  const handleAddDonor = () => {
    navigate("/donor/addDonor"); // route to your Add Donor page
  };

  // ---------------- Rendering ----------------
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

        <a href="/donor/dashboard">
          Dashboard
        </a>
        <a href="/donor/donors" className="active">Donors List</a>
        <a href="/donor/donations">Donations</a>
        <a href="/donor/reports">Reports</a>

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
          ➜] Logout
        </a>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        <h1>Donors</h1>
        <br />

        {/* Search + Add Button */}
        <div
          className="table-header"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
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
                    <tr key={i}>
                      <td data-title="ID">{d.id}</td>
                      <td data-title="Name">{d.name}</td>
                      <td data-title="Email">{d.email}</td>
                      <td data-title="Phone">{d.phone}</td>
                      <td className="actions">
                        <button className="add-btn" onClick={() => openViewModal(d)}>
                          View
                        </button>
                        <button className="edit-btn" onClick={() => openEditModal(d, index)}>
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

              <label>Type</label>
              <select
                value={editDonor.type}
                onChange={(e) =>
                  setEditDonor({
                    ...editDonor,
                    type: e.target.value as Donor["type"],
                  })
                }
              >
                <option value="Individual">Individual</option>
                <option value="Organization">Organization</option>
                <option value="Anonymous">Anonymous</option>
              </select>

              <div className="filter-popup-buttons">
                <button className="add-btn" onClick={saveDonor}>Save</button>
                <button className="delete-btn" onClick={closeEditModal}>Close</button>
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
                  <tr><td>Donor ID</td><td>{viewDonor.id}</td></tr>
                  <tr><td>Name</td><td>{viewDonor.name}</td></tr>
                  <tr><td>Email</td><td>{viewDonor.email}</td></tr>
                  <tr><td>Phone</td><td>{viewDonor.phone}</td></tr>
                  <tr><td>Type</td><td>{viewDonor.type}</td></tr>
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
