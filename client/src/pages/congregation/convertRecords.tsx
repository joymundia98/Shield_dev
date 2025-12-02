import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

interface Convert {
  name: string;
  type: "Visitor" | "Member";
  convertDate: string;
}

const initialConverts: Convert[] = [
  { name: "John Doe", type: "Visitor", convertDate: "2025-01-12" },
  { name: "Mary Smith", type: "Member", convertDate: "2025-02-20" },
  { name: "Paul Johnson", type: "Visitor", convertDate: "2025-03-05" },
  { name: "Linda Williams", type: "Member", convertDate: "2025-04-15" },
];

const ConvertsPage: React.FC = () => {
  const navigate = useNavigate();

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    document.body.classList.toggle("sidebar-open", sidebarOpen);
    return () => document.body.classList.remove("sidebar-open");
  }, [sidebarOpen]);

  // Converts
  const [converts, setConverts] = useState<Convert[]>(initialConverts);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [editConvert, setEditConvert] = useState<Convert | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [viewConvert, setViewConvert] = useState<Convert | null>(null);

  const openEditModal = (convert?: Convert, index?: number) => {
    setEditConvert(convert || null);
    setEditIndex(index ?? null);
  };
  const closeEditModal = () => setEditConvert(null);

  const openViewModal = (convert: Convert) => setViewConvert(convert);
  const closeViewModal = () => setViewConvert(null);

  const handleSaveConvert = (convert: Convert) => {
    if (editIndex !== null) {
      const updated = [...converts];
      updated[editIndex] = convert;
      setConverts(updated);
    }
    closeEditModal();
  };

  const handleAddConvert = () => navigate("/congregation/addConvert");

  // Filtered & grouped by type
  const filteredConverts = useMemo(
    () =>
      converts.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [converts, searchQuery]
  );

  const groupedConverts = useMemo(() => {
    return filteredConverts.reduce<Record<string, Convert[]>>((groups, c) => {
      if (!groups[c.type]) groups[c.type] = [];
      groups[c.type].push(c);
      return groups;
    }, {} as Record<string, Convert[]>);
  }, [filteredConverts]);

  return (
    <div className="dashboard-wrapper converts-wrapper">
      {/* HAMBURGER */}
      <button className="hamburger" onClick={toggleSidebar}>
        &#9776;
      </button>

      {/* SIDEBAR */}
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

      {/* MAIN CONTENT */}
      <div className="dashboard-content">
        <header>
          <h1>Converts Records</h1>
          <div className="header-buttons">
            <br/>
            <button
              className="add-btn"
              onClick={() => navigate("/congregation/converts")}
            >
              ← Converts Overview
            </button>&emsp;
            <button className="add-btn" onClick={handleAddConvert}>
              + Add New Convert
            </button>
          </div>
        </header>

        {/* Search */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1rem",
          }}
        >
          <input
            type="text"
            placeholder="Search converts..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Converts by Type */}
        {Object.entries(groupedConverts).map(([type, list]) => (
          <div className="category-block" key={type}>
            <br/>
            <h2>{type}s</h2>
            <table className="responsive-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Convert Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((c) => {
                  const index = converts.indexOf(c);
                  return (
                    <tr key={index}>
                      <td data-title="Name">{c.name}</td>
                      <td data-title="Convert Date">{c.convertDate}</td>
                      <td className="actions">
                        <button className="view-btn" onClick={() => openViewModal(c)}>
                          View
                        </button>
                        <button className="edit-btn" onClick={() => openEditModal(c, index)}>
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
        {editConvert && (
          <>
            <div className="overlay" onClick={closeEditModal}></div>
            <div className="filter-popup modal-wide">
              <h3>Edit Convert</h3>
              <label>Name</label>
              <input
                type="text"
                value={editConvert.name}
                disabled
              />
              <label>Type</label>
              <select
                value={editConvert.type}
                onChange={(e) =>
                  setEditConvert({ ...editConvert, type: e.target.value as "Visitor" | "Member" })
                }
              >
                <option value="Visitor">Visitor</option>
                <option value="Member">Member</option>
              </select>
              <label>Convert Date</label>
              <input
                type="date"
                value={editConvert.convertDate}
                onChange={(e) =>
                  setEditConvert({ ...editConvert, convertDate: e.target.value })
                }
              />
              <div className="filter-popup-buttons">
                <button className="add-btn" onClick={() => handleSaveConvert(editConvert)}>
                  Save
                </button>
                <button className="delete-btn" onClick={closeEditModal}>
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}

        {/* View Modal */}
        {viewConvert && (
          <>
            <div className="overlay" onClick={closeViewModal}></div>
            <div className="filter-popup modal-wide">
              <h3>Convert Profile</h3>
              <table className="responsive-table view-table">
                <tbody>
                  <tr>
                    <td>Name</td>
                    <td>{viewConvert.name}</td>
                  </tr>
                  <tr>
                    <td>Type</td>
                    <td>{viewConvert.type}</td>
                  </tr>
                  <tr>
                    <td>Convert Date</td>
                    <td>{viewConvert.convertDate}</td>
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

export default ConvertsPage;
