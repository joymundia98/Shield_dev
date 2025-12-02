import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

interface Member {
  name: string;
  category: string;
  age: number;
  gender: "Male" | "Female";
  joinDate: string;
  address: string;
  phone: string;
  email: string;
  photo: string;
}

const initialMembers: Member[] = [
  {
    name: "John Doe",
    category: "Adult",
    age: 35,
    gender: "Male",
    joinDate: "2020-05-10",
    address: "123 Church St",
    phone: "+260971234567",
    email: "john@example.com",
    photo: "https://via.placeholder.com/120",
  },
  {
    name: "Mary Smith",
    category: "Youth",
    age: 18,
    gender: "Female",
    joinDate: "2022-01-15",
    address: "456 Faith Rd",
    phone: "+260971112233",
    email: "mary@example.com",
    photo: "https://via.placeholder.com/120",
  },
];

const ChurchMembersPage: React.FC = () => {
  const navigate = useNavigate();

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Members
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [viewMember, setViewMember] = useState<Member | null>(null);

  const openEditModal = (member?: Member, index?: number) => {
    setEditMember(member || null);
    setEditIndex(index ?? null);
  };
  const closeEditModal = () => setEditMember(null);

  const openViewModal = (member: Member) => setViewMember(member);
  const closeViewModal = () => setViewMember(null);

  const handleSaveMember = (member: Member) => {
    if (editIndex !== null) {
      const updated = [...members];
      updated[editIndex] = member;
      setMembers(updated);
    }
    closeEditModal();
  };

  const handleAddMember = () => {
    navigate("/congregation/add-member");
  };

  // Filtered & grouped members by category
  const filteredMembers = useMemo(() => {
    return members.filter((m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [members, searchQuery]);

  const groupedMembers = useMemo(() => {
    return filteredMembers.reduce<Record<string, Member[]>>((groups, m) => {
      if (!groups[m.category]) groups[m.category] = [];
      groups[m.category].push(m);
      return groups;
    }, {});
  }, [filteredMembers]);

  return (
    <div className="dashboard-wrapper" style={{ display: "flex" }}>
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

        <h2>CONGREGATION</h2>
        <a href="/congregation/dashboard">Dashboard</a>
        <a href="/congregation/members" className="active">Members</a>
        <a href="/congregation/attendance">Attendance</a>
        <a href="/congregation/followups">Follow-ups</a>
        <a href="/congregation/visitors">Visitors</a>
        <a href="/congregation/converts">New Converts</a>

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

      {/* Main Content */}
      <div
        className="dashboard-content"
        style={{ flex: 1, padding: "1rem", minWidth: 0 }}
      >
        {/* Header */}
        <header>
          <h1>Church Members Records</h1>
          <div>
            <br/>
            <button
              className="add-btn"
              onClick={() => navigate("/congregation/members")}
            >
              ← Members Overview
            </button>
            <button className="hamburger" onClick={toggleSidebar}>
              &#9776;
            </button>
          </div>
        </header>

        {/* Search + Add */}
        <div
          className="table-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1rem",
          }}
        >
          <input
            type="text"
            placeholder="Search members..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="add-btn" onClick={handleAddMember}>
            + Add New Member
          </button>
        </div>

        {/* Members by Category */}
        {Object.entries(groupedMembers).map(([category, memberList]) => (
          <div className="category-block" key={category}>
            <h2>{category}</h2>
            <table className="responsive-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Join Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((m) => {
                  const index = members.indexOf(m);
                  return (
                    <tr key={index}>
                      <td data-title="Name">{m.name}</td>
                      <td data-title="Age">{m.age}</td>
                      <td data-title="Gender">{m.gender}</td>
                      <td data-title="Join Date">{m.joinDate}</td>
                      <td data-title="Actions" className="actions">
                        <button className="view-btn" onClick={() => openViewModal(m)}>
                          View
                        </button>
                        <button
                          className="edit-btn"
                          onClick={() => openEditModal(m, index)}
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
        {editMember && (
          <>
            <div className="overlay" onClick={closeEditModal}></div>
            <div className="filter-popup modal-wide">
              <h3>Edit Member</h3>
              <label>Name</label>
              <input
                type="text"
                value={editMember.name}
                onChange={(e) =>
                  setEditMember({ ...editMember, name: e.target.value })
                }
              />
              <label>Category</label>
              <select
                value={editMember.category}
                onChange={(e) =>
                  setEditMember({ ...editMember, category: e.target.value })
                }
              >
                <option value="">-- Select Category --</option>
                <option value="Adult">Adult</option>
                <option value="Youth">Youth</option>
                <option value="Children">Children</option>
                <option value="Widow/Widower">Widow/Widower</option>
                <option value="Orphan">Orphan</option>
                <option value="Disabled">Disabled</option>
              </select>
              <label>Age</label>
              <input
                type="number"
                value={editMember.age}
                onChange={(e) =>
                  setEditMember({ ...editMember, age: parseInt(e.target.value) })
                }
              />
              <label>Gender</label>
              <select
                value={editMember.gender}
                onChange={(e) =>
                  setEditMember({
                    ...editMember,
                    gender: e.target.value as "Male" | "Female",
                  })
                }
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <label>Join Date</label>
              <input
                type="date"
                value={editMember.joinDate}
                onChange={(e) =>
                  setEditMember({ ...editMember, joinDate: e.target.value })
                }
              />
              <label>Address</label>
              <input
                type="text"
                value={editMember.address}
                onChange={(e) =>
                  setEditMember({ ...editMember, address: e.target.value })
                }
              />
              <label>Phone</label>
              <input
                type="text"
                value={editMember.phone}
                onChange={(e) =>
                  setEditMember({ ...editMember, phone: e.target.value })
                }
              />
              <label>Email</label>
              <input
                type="email"
                value={editMember.email}
                onChange={(e) =>
                  setEditMember({ ...editMember, email: e.target.value })
                }
              />
              <label>Photo URL</label>
              <input
                type="text"
                value={editMember.photo}
                onChange={(e) =>
                  setEditMember({ ...editMember, photo: e.target.value })
                }
              />
              <div className="filter-popup-buttons">
                <button className="add-btn" onClick={() => handleSaveMember(editMember)}>
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
        {viewMember && (
          <>
            <div className="overlay" onClick={closeViewModal}></div>
            <div className="filter-popup modal-wide">
              <h3>Member Profile</h3>
              <table className="responsive-table view-table">
                <tbody>
                  <tr>
                    <td>Photo</td>
                    <td>
                      <img src={viewMember.photo} style={{ maxWidth: 120 }} />
                    </td>
                  </tr>
                  <tr>
                    <td>Name</td>
                    <td>{viewMember.name}</td>
                  </tr>
                  <tr>
                    <td>Category</td>
                    <td>{viewMember.category}</td>
                  </tr>
                  <tr>
                    <td>Age</td>
                    <td>{viewMember.age}</td>
                  </tr>
                  <tr>
                    <td>Gender</td>
                    <td>{viewMember.gender}</td>
                  </tr>
                  <tr>
                    <td>Join Date</td>
                    <td>{viewMember.joinDate}</td>
                  </tr>
                  <tr>
                    <td>Address</td>
                    <td>{viewMember.address}</td>
                  </tr>
                  <tr>
                    <td>Phone</td>
                    <td>{viewMember.phone}</td>
                  </tr>
                  <tr>
                    <td>Email</td>
                    <td>{viewMember.email}</td>
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

export default ChurchMembersPage;
