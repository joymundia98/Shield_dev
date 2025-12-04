import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/global.css";

interface Member {
  member_id: number;
  full_name: string;
  category: "Adult" | "Youth" | "Child" | "Elderly";
  age: number;
  gender: "Male" | "Female";
  date_joined: string;
  address?: string;
  phone?: string;
  email?: string;
  photo?: string;
}

const ChurchMembersPage: React.FC = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [members, setMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  // Fetch members from backend
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/members");
        const data: Member[] = res.data.map((m: any) => {
          // Assign category based on age
          let category: Member["category"] = "Adult";
          if (m.age < 18) category = "Child";
          else if (m.age <= 30) category = "Youth";
          else if (m.age > 60) category = "Elderly";

          return {
            member_id: m.member_id,
            full_name: m.full_name,
            category,
            age: m.age,
            gender: m.gender,
            date_joined: m.date_joined?.split("T")[0] || "",
            address: m.address || "",
            phone: m.phone || "",
            email: m.email || "",
            photo: m.photo || "https://via.placeholder.com/120",
          };
        });
        setMembers(data);
        console.log("Fetched Members:", data);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };
    fetchMembers();
  }, []);

  const filteredMembers = useMemo(() => {
    return members.filter((m) =>
      m.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [members, searchQuery]);

  const groupedMembers = useMemo(() => {
    return filteredMembers.reduce<Record<string, Member[]>>((groups, m) => {
      if (!groups[m.category]) groups[m.category] = [];
      groups[m.category].push(m);
      return groups;
    }, {} as Record<string, Member[]>);
  }, [filteredMembers]);

  return (
    <div className="dashboard-wrapper members-wrapper">
      <button className="hamburger" onClick={toggleSidebar}>
        &#9776;
      </button>

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
        <a href="/congregation/members" className="active">Members</a>
        <a href="/congregation/attendance">Attendance</a>
        <a href="/congregation/followups">Follow-ups</a>
        <a href="/congregation/visitors">Visitors</a>
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

      <div className="dashboard-content">
        <header>
          <h1>Church Members Records</h1>
          <div className="header-buttons">
            <br/>
            <button
              className="add-btn"
              onClick={() => navigate("/congregation/members")}
            >
              ← Members Overview
            </button>
          </div>
        </header>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
          <input
            type="text"
            placeholder="Search members..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="add-btn" onClick={() => navigate("/congregation/addMember")}>
            + Add New Member
          </button>
        </div>

        {Object.entries(groupedMembers).map(([category, memberList]) => (
          <div className="category-block" key={category}>
            <br/>
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
                    <tr key={m.member_id}>
                      <td data-title="Name">{m.full_name}</td>
                      <td data-title="Age">{m.age}</td>
                      <td data-title="Gender">{m.gender}</td>
                      <td data-title="Join Date">{m.date_joined}</td>
                      <td data-title="Actions" className="actions">
                        <button className="view-btn" onClick={() => openViewModal(m)}>View</button>
                        <button className="edit-btn" onClick={() => openEditModal(m, index)}>Edit</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}

        {editMember && (
          <>
            <div className="overlay" onClick={closeEditModal}></div>
            <div className="filter-popup modal-wide">
              <h3>Edit Member</h3>
              <label>Name</label>
              <input
                type="text"
                value={editMember.full_name}
                onChange={(e) => setEditMember({ ...editMember, full_name: e.target.value })}
              />
              <label>Category</label>
              <select
                value={editMember.category}
                onChange={(e) => setEditMember({ ...editMember, category: e.target.value as any })}
              >
                <option value="">-- Select Category --</option>
                <option value="Adult">Adult</option>
                <option value="Youth">Youth</option>
                <option value="Child">Child</option>
                <option value="Elderly">Elderly</option>
              </select>
              <label>Age</label>
              <input
                type="number"
                value={editMember.age}
                onChange={(e) => setEditMember({ ...editMember, age: parseInt(e.target.value) })}
              />
              <label>Gender</label>
              <select
                value={editMember.gender}
                onChange={(e) => setEditMember({ ...editMember, gender: e.target.value as "Male" | "Female" })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <label>Join Date</label>
              <input
                type="date"
                value={editMember.date_joined}
                onChange={(e) => setEditMember({ ...editMember, date_joined: e.target.value })}
              />
              <label>Phone</label>
              <input
                type="text"
                value={editMember.phone}
                onChange={(e) => setEditMember({ ...editMember, phone: e.target.value })}
              />
              <label>Email</label>
              <input
                type="email"
                value={editMember.email}
                onChange={(e) => setEditMember({ ...editMember, email: e.target.value })}
              />
              <div className="filter-popup-buttons">
                <button className="add-btn" onClick={() => {
                  if(editIndex !== null){
                    const updated = [...members];
                    updated[editIndex] = editMember;
                    setMembers(updated);
                  }
                  closeEditModal();
                }}>Save</button>
                <button className="delete-btn" onClick={closeEditModal}>Close</button>
              </div>
            </div>
          </>
        )}

        {viewMember && (
          <>
            <div className="overlay" onClick={closeViewModal}></div>
            <div className="filter-popup modal-wide">
              <h3>Member Profile</h3>
              <table className="responsive-table view-table">
                <tbody>
                  <tr><td>Photo</td><td><img src={viewMember.photo} style={{ maxWidth: 120 }} /></td></tr>
                  <tr><td>Name</td><td>{viewMember.full_name}</td></tr>
                  <tr><td>Category</td><td>{viewMember.category}</td></tr>
                  <tr><td>Age</td><td>{viewMember.age}</td></tr>
                  <tr><td>Gender</td><td>{viewMember.gender}</td></tr>
                  <tr><td>Join Date</td><td>{viewMember.date_joined}</td></tr>
                  <tr><td>Phone</td><td>{viewMember.phone}</td></tr>
                  <tr><td>Email</td><td>{viewMember.email}</td></tr>
                </tbody>
              </table>
              <div className="filter-popup-buttons">
                <button className="delete-btn" onClick={closeViewModal}>Close</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChurchMembersPage;
