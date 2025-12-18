import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

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
  const [converts, setConverts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch Converts Data
  const fetchConverts = async () => {
    try {
      // Fetch the converts, visitors, and members data
      const [convertsResponse, visitorsResponse, membersResponse] = await Promise.all([
        fetch("http://localhost:3000/api/converts").then(res => res.json()),
        fetch("http://localhost:3000/api/visitor").then(res => res.json()),
        fetch("http://localhost:3000/api/members").then(res => res.json()),
      ]);

      const visitors = visitorsResponse.reduce((acc, visitor) => {
        acc[visitor.id] = visitor;  // Map visitor by ID
        return acc;
      }, {});

      const members = membersResponse.reduce((acc, member) => {
        acc[member.member_id] = member;  // Map member by ID
        return acc;
      }, {});

      // Map converts to include names from the appropriate table
      const updatedConverts = convertsResponse.map(convert => {
        let name = '';
        if (convert.convert_type === "visitor" && visitors[convert.visitor_id]) {
          name = visitors[convert.visitor_id].name;
        } else if (convert.convert_type === "member" && members[convert.member_id]) {
          name = members[convert.member_id].full_name;
        }
        return { ...convert, name };
      });

      setConverts(updatedConverts);
    } catch (error) {
      console.error("Error fetching converts data:", error);
    }
  };

  useEffect(() => {
    fetchConverts();
  }, []);

  // Modals
  const [editConvert, setEditConvert] = useState<any | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [viewConvert, setViewConvert] = useState<any | null>(null);

  const openEditModal = (convert?: any, index?: number) => {
    setEditConvert(convert || null);
    setEditIndex(index ?? null);
  };
  const closeEditModal = () => setEditConvert(null);

  const openViewModal = (convert: any) => setViewConvert(convert);
  const closeViewModal = () => setViewConvert(null);

  const handleSaveConvert = (convert: any) => {
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
    return filteredConverts.reduce<Record<string, any[]>>((groups, c) => {
      if (!groups[c.convert_type]) groups[c.convert_type] = [];
      groups[c.convert_type].push(c);
      return groups;
    }, {} as Record<string, any[]>);
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
            <br />
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
            <br />
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
                {list.map((c, index) => (
                  <tr key={index}>
                    <td data-title="Name">{c.name}</td>
                    <td data-title="Convert Date">
                      {new Date(c.convert_date).toLocaleDateString()}
                    </td>
                    <td className="actions">
                      <button className="view-btn" onClick={() => openViewModal(c)}>
                        View
                      </button>
                      <button className="edit-btn" onClick={() => openEditModal(c, index)}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
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
                value={editConvert.convert_type}
                onChange={(e) =>
                  setEditConvert({ ...editConvert, convert_type: e.target.value })
                }
              >
                <option value="visitor">Visitor</option>
                <option value="member">Member</option>
              </select>
              <label>Convert Date</label>
              <input
                type="date"
                value={editConvert.convert_date}
                onChange={(e) =>
                  setEditConvert({ ...editConvert, convert_date: e.target.value })
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
                    <td>{viewConvert.convert_type}</td>
                  </tr>
                  <tr>
                    <td>Convert Date</td>
                    <td>{new Date(viewConvert.convert_date).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td>Follow-up Status</td>
                    <td>{viewConvert.follow_up_status}</td>
                  </tr>
                </tbody>
              </table>
              <div className="filter-popup-buttons">
                <button className="add-btn" onClick={closeViewModal}>
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
