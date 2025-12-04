import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

interface Visitor {
  photo: string;
  name: string;
  gender: "Male" | "Female";
  age: number;
  visitDate: string;
  address: string;
  phone: string;
  email: string;
  invitedBy: string;
  serviceAttended: string;
  foundBy: string;
  firstTime: boolean;
  needsFollowUp: boolean;
}

// SAMPLE DATA – Replace with API later
const initialVisitors: Visitor[] = [
  {
    photo: "https://via.placeholder.com/120",
    name: "James Chanda",
    gender: "Male",
    age: 28,
    visitDate: "2024-10-05",
    address: "Kabulonga, Lusaka",
    phone: "+260977000111",
    email: "james@example.com",
    invitedBy: "Brother Peter",
    serviceAttended: "Sunday Service",
    foundBy: "Friend/Family",
    firstTime: true,
    needsFollowUp: true,
  },
  {
    photo: "https://via.placeholder.com/120",
    name: "Linda Mwila",
    gender: "Female",
    age: 22,
    visitDate: "2024-11-02",
    address: "Chelstone, Lusaka",
    phone: "+260970123456",
    email: "linda@example.com",
    invitedBy: "Online",
    serviceAttended: "Youth Service",
    foundBy: "Social Media",
    firstTime: false,
    needsFollowUp: false,
  },
];

const VisitorRecordsPage: React.FC = () => {
  const navigate = useNavigate();

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    if (sidebarOpen) document.body.classList.add("sidebar-open");
    else document.body.classList.remove("sidebar-open");

    return () => document.body.classList.remove("sidebar-open");
  }, [sidebarOpen]);

  // Data
  const [visitors, setVisitors] = useState<Visitor[]>(initialVisitors);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [viewVisitor, setViewVisitor] = useState<Visitor | null>(null);
  const [editVisitor, setEditVisitor] = useState<Visitor | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const openViewModal = (v: Visitor) => setViewVisitor(v);
  const closeViewModal = () => setViewVisitor(null);

  const openEditModal = (v: Visitor, index: number) => {
    setEditVisitor(v);
    setEditIndex(index);
  };
  const closeEditModal = () => setEditVisitor(null);

  const handleSaveVisitor = (updated: Visitor) => {
    if (editIndex !== null) {
      const newList = [...visitors];
      newList[editIndex] = updated;
      setVisitors(newList);
    }
    closeEditModal();
  };

  // Filtering
  const filteredVisitors = useMemo(() => {
    return visitors.filter((v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [visitors, searchQuery]);

  // Group by Service Attended
  const groupedVisitors = useMemo(() => {
    return filteredVisitors.reduce<Record<string, Visitor[]>>((groups, v) => {
      if (!groups[v.serviceAttended]) groups[v.serviceAttended] = [];
      groups[v.serviceAttended].push(v);
      return groups;
    }, {});
  }, [filteredVisitors]);

  return (
    <div className="dashboard-wrapper visitors-wrapper">
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
        <a href="/congregation/visitors" className="active">Visitors</a>
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

      {/* MAIN CONTENT */}
      <div className="dashboard-content">
        <header>
          <h1>Visitors Records</h1>

          <div className="header-buttons">
            <br />
            <button className="add-btn" onClick={() => navigate("/congregation/visitors")}>
              ← Visitors Overview
            </button>
          </div>
        </header>

        {/* Search + Add button */}
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
            placeholder="Search visitors..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <button className="add-btn" onClick={() => navigate("/congregation/addVisitors")}>
            + Add Visitor
          </button>
        </div>

        {/* GROUPED VISITORS */}
        {Object.entries(groupedVisitors).map(([service, list]) => (
          <div className="category-block" key={service}>
            <br />
            <h2>{service}</h2>

            <table className="responsive-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Visit Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {list.map((v) => {
                  const index = visitors.indexOf(v);
                  return (
                    <tr key={index}>
                      <td data-title="Name">{v.name}</td>
                      <td data-title="Age">{v.age}</td>
                      <td data-title="Gender">{v.gender}</td>
                      <td data-title="Visit Date">{v.visitDate}</td>

                      <td data-title="Actions" className="actions">
                        <button className="view-btn" onClick={() => openViewModal(v)}>
                          View
                        </button>

                        <button
                          className="edit-btn"
                          onClick={() => openEditModal(v, index)}
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

        {/* VIEW MODAL */}
        {viewVisitor && (
          <>
            <div className="overlay" onClick={closeViewModal}></div>
            <div className="filter-popup modal-wide">
              <h3>Visitor Profile</h3>

              <table className="responsive-table view-table">
                <tbody>
                  <tr>
                    <td>Photo</td>
                    <td>
                      <img src={viewVisitor.photo} style={{ maxWidth: 120 }} />
                    </td>
                  </tr>

                  <tr>
                    <td>Name</td>
                    <td>{viewVisitor.name}</td>
                  </tr>

                  <tr>
                    <td>Gender</td>
                    <td>{viewVisitor.gender}</td>
                  </tr>

                  <tr>
                    <td>Age</td>
                    <td>{viewVisitor.age}</td>
                  </tr>

                  <tr>
                    <td>Visit Date</td>
                    <td>{viewVisitor.visitDate}</td>
                  </tr>

                  <tr>
                    <td>Address</td>
                    <td>{viewVisitor.address}</td>
                  </tr>

                  <tr>
                    <td>Phone</td>
                    <td>{viewVisitor.phone}</td>
                  </tr>

                  <tr>
                    <td>Email</td>
                    <td>{viewVisitor.email}</td>
                  </tr>

                  <tr>
                    <td>Invited By</td>
                    <td>{viewVisitor.invitedBy}</td>
                  </tr>

                  <tr>
                    <td>Service Attended</td>
                    <td>{viewVisitor.serviceAttended}</td>
                  </tr>

                  <tr>
                    <td>Heard Through</td>
                    <td>{viewVisitor.foundBy}</td>
                  </tr>

                  <tr>
                    <td>First-Time?</td>
                    <td>{viewVisitor.firstTime ? "Yes" : "No"}</td>
                  </tr>

                  <tr>
                    <td>Needs Follow-Up?</td>
                    <td>{viewVisitor.needsFollowUp ? "Yes" : "No"}</td>
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

        {/* EDIT MODAL */}
        {editVisitor && (
          <>
            <div className="overlay" onClick={closeEditModal}></div>
            <div className="filter-popup modal-wide">
              <h3>Edit Visitor</h3>

              <label>Name</label>
              <input
                type="text"
                value={editVisitor.name}
                onChange={(e) =>
                  setEditVisitor({ ...editVisitor, name: e.target.value })
                }
              />

              <label>Gender</label>
              <select
                value={editVisitor.gender}
                onChange={(e) =>
                  setEditVisitor({
                    ...editVisitor,
                    gender: e.target.value as "Male" | "Female",
                  })
                }
              >
                <option>Male</option>
                <option>Female</option>
              </select>

              <label>Age</label>
              <input
                type="number"
                value={editVisitor.age}
                onChange={(e) =>
                  setEditVisitor({ ...editVisitor, age: Number(e.target.value) })
                }
              />

              <label>Visit Date</label>
              <input
                type="date"
                value={editVisitor.visitDate}
                onChange={(e) =>
                  setEditVisitor({ ...editVisitor, visitDate: e.target.value })
                }
              />

              <label>Address</label>
              <input
                type="text"
                value={editVisitor.address}
                onChange={(e) =>
                  setEditVisitor({ ...editVisitor, address: e.target.value })
                }
              />

              <label>Phone</label>
              <input
                type="text"
                value={editVisitor.phone}
                onChange={(e) =>
                  setEditVisitor({ ...editVisitor, phone: e.target.value })
                }
              />

              <label>Email</label>
              <input
                type="email"
                value={editVisitor.email}
                onChange={(e) =>
                  setEditVisitor({ ...editVisitor, email: e.target.value })
                }
              />

              <label>Invited By</label>
              <input
                type="text"
                value={editVisitor.invitedBy}
                onChange={(e) =>
                  setEditVisitor({ ...editVisitor, invitedBy: e.target.value })
                }
              />

              <label>Service Attended</label>
              <select
                value={editVisitor.serviceAttended}
                onChange={(e) =>
                  setEditVisitor({ ...editVisitor, serviceAttended: e.target.value })
                }
              >
                <option>Sunday Service</option>
                <option>Midweek Service</option>
                <option>Youth Service</option>
                <option>Special Program</option>
              </select>

              <label>Heard Through</label>
              <select
                value={editVisitor.foundBy}
                onChange={(e) =>
                  setEditVisitor({ ...editVisitor, foundBy: e.target.value })
                }
              >
                <option>Friend/Family</option>
                <option>Online Search</option>
                <option>Social Media</option>
                <option>Church Event</option>
                <option>Walk-in</option>
              </select>

              <label>First Time Visitor</label>
              <input
                type="checkbox"
                checked={editVisitor.firstTime}
                onChange={(e) =>
                  setEditVisitor({ ...editVisitor, firstTime: e.target.checked })
                }
              />

              <label>Needs Follow-Up</label>
              <input
                type="checkbox"
                checked={editVisitor.needsFollowUp}
                onChange={(e) =>
                  setEditVisitor({ ...editVisitor, needsFollowUp: e.target.checked })
                }
              />

              <label>Photo URL</label>
              <input
                type="text"
                value={editVisitor.photo}
                onChange={(e) =>
                  setEditVisitor({ ...editVisitor, photo: e.target.value })
                }
              />

              <div className="filter-popup-buttons">
                <button className="add-btn" onClick={() => handleSaveVisitor(editVisitor)}>
                  Save
                </button>
                <button className="delete-btn" onClick={closeEditModal}>
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

export default VisitorRecordsPage;
