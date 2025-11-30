import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

interface Staff {
  name: string;
  department: string;
  role: string;
  status: "active" | "on-leave" | "unpaid";
  joinDate: string;
  gender: "Male" | "Female";
  NRC: string;
  address: string;
  phone: string;
  email: string;
  photo: string;
  paid: boolean;
}

interface Filter {
  department: string;
  status: string;
}

const StaffDirectoryPage: React.FC = () => {
  const navigate = useNavigate();

  // ---------------- Sidebar ----------------
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    if (sidebarOpen) document.body.classList.add("sidebar-open");
    else document.body.classList.remove("sidebar-open");
  }, [sidebarOpen]);

  // ---------------- Staff Data ----------------
  const [staffData, setStaffData] = useState<Staff[]>([
    {
      name: "Kofi Appiah",
      department: "Finance/Admin",
      role: "Accountant",
      status: "active",
      joinDate: "2021-03-15",
      gender: "Male",
      NRC: "12345678/12/1",
      address: "123 Lusaka St, Lusaka",
      phone: "+260971234567",
      email: "kofi@appiah.com",
      photo: "https://via.placeholder.com/120",
      paid: true
    },
    {
      name: "Sarah Owusu",
      department: "Youth Ministry",
      role: "Youth Leader",
      status: "on-leave",
      joinDate: "2019-08-20",
      gender: "Female",
      NRC: "87654321/12/2",
      address: "456 Livingstone Rd, Lusaka",
      phone: "+260971112233",
      email: "sarah@church.org",
      photo: "https://via.placeholder.com/120",
      paid: false
    }
  ]);

  // ---------------- Filters/Search ----------------
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<Filter>({ department: "", status: "" });
  const [tempFilter, setTempFilter] = useState(filter);
  const [showFilterPopup, setShowFilterPopup] = useState(false);

  const openFilter = () => {
    setTempFilter(filter);
    setShowFilterPopup(true);
  };
  const closeFilter = () => setShowFilterPopup(false);
  const handleApplyFilter = () => {
    setFilter(tempFilter);
    closeFilter();
  };
  const handleClearFilter = () => {
    setFilter({ department: "", status: "" });
    setTempFilter({ department: "", status: "" });
    closeFilter();
  };

  const filteredStaff = useMemo(() => {
    return staffData.filter(s => {
      if (filter.department && s.department !== filter.department) return false;
      if (filter.status && s.status !== filter.status) return false;
      if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [staffData, filter, searchQuery]);

  // ---------------- Modals ----------------
  const [editStaff, setEditStaff] = useState<Staff | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [viewStaff, setViewStaff] = useState<Staff | null>(null);

  const openEditModal = (staff?: Staff, index?: number) => {
    setEditStaff(staff || null);
    setEditIndex(index ?? null);
  };
  const closeEditModal = () => setEditStaff(null);

  const openViewModal = (staff: Staff) => setViewStaff(staff);
  const closeViewModal = () => setViewStaff(null);

  const handleSaveStaff = (staff: Staff) => {
    if (editIndex !== null) {
      const updated = [...staffData];
      updated[editIndex] = staff;
      setStaffData(updated);
    }
    closeEditModal();
  };

  const handleAddStaff = () => {
    navigate("/staff/add", { state: { addStaffCallback: setStaffData } });
  };

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
              id="closeSidebarButton"
              checked={sidebarOpen}
              onChange={toggleSidebar}
            />
            <span className="button"></span>
            <span className="label">X</span>
          </div>
        </div>

        <h2>HR MANAGER</h2>
        <a href="/hr/dashboard">Dashboard</a>
        <a href="/staffDirectory">Staff Directory</a>
        <a href="/hr/leave">Leave Management</a>
        <a href="/hr/departments">Departments</a>
        {/*<a href="#">Volunteers</a>
        <a href="/hr/attendance">Attendance</a>
        <a href="#">Training</a>
        <a href="#">HR Documents</a>*/}

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
        <h1>Staff Directory</h1>

        <br/><br/>

        {/* Add + Search */}
        <div className="table-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <input
            type="text"
            className="search-input"
            placeholder="Search staff..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="add-btn" onClick={handleAddStaff}>
            + Add New Staff
          </button>
          <button className="filter-btn" onClick={openFilter}>
            &#x1F5D1; Filter
          </button>
        </div>

        {/* Departments */}
        {Object.entries(
          filteredStaff.reduce((groups: Record<string, Staff[]>, s) => {
            if (!groups[s.department]) groups[s.department] = [];
            groups[s.department].push(s);
            return groups;
          }, {})
        ).map(([dept, staffList]) => (
          <div className="department-block" key={dept}>
            <h2>{dept}</h2>
            <table className="responsive-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Join Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((s, i) => {
                  const index = staffData.indexOf(s);
                  return (
                    <tr key={i}>
                      <td data-title="Name">{s.name}</td>
                      <td data-title="Role">{s.role}</td>
                      <td data-title="Status">
                        <span className={`status ${s.status}`}>{s.status.replace("-", " ")}</span>
                      </td>
                      <td data-title="Join Date">{s.joinDate}</td>
                      <td className="actions" data-title="Actions">
                        <button onClick={() => openViewModal(s)}>View</button>
                        <button onClick={() => openEditModal(s, index)}>Edit</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}

        {/* Filter Popup */}
        {showFilterPopup && (
          <>
            <div className="overlay" onClick={closeFilter}></div>
            <div className="filter-popup">
              <h3>Filter Staff</h3>
              <label>
                Department:
                <select
                  value={tempFilter.department}
                  onChange={(e) => setTempFilter(prev => ({ ...prev, department: e.target.value }))}
                >
                  <option value="">All</option>
                  <option value="Finance/Admin">Finance/Admin</option>
                  <option value="Youth Ministry">Youth Ministry</option>
                  <option value="Pastoral / Clergy">Pastoral / Clergy</option>
                  <option value="Children's Ministry">Children's Ministry</option>
                  <option value="Music / Choir / Worship">Music / Choir / Worship</option>
                </select>
              </label>
              <label>
                Status:
                <select
                  value={tempFilter.status}
                  onChange={(e) => setTempFilter(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="">All</option>
                  <option value="active">Active</option>
                  <option value="on-leave">On Leave</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </label>
              <div className="filter-popup-buttons">
                <button className="add-btn" onClick={handleApplyFilter}>Apply Filter</button>
                <button className="delete-btn" onClick={handleClearFilter}>Clear All</button>
              </div>
            </div>
          </>
        )}

        {/* Edit Modal */}
        {editStaff && (
          <>
            <div className="overlay" onClick={closeEditModal}></div>
            <div className="filter-popup modal-wide">
              <h3>Edit Staff Profile</h3>
              {/* Inputs */}
              <label>Name</label>
              <input type="text" value={editStaff.name} onChange={(e) => setEditStaff({ ...editStaff, name: e.target.value })} />
              <label>Department</label>
              <select value={editStaff.department} onChange={(e) => setEditStaff({ ...editStaff, department: e.target.value })}>
                <option value="">-- Select Department --</option>
                <option value="Administration / Finance">Administration / Finance</option>
                <option value="Pastoral / Clergy">Pastoral / Clergy</option>
                <option value="Youth Ministry">Youth Ministry</option>
                <option value="Children's Ministry">Children's Ministry</option>
              </select>
              <label>Role</label>
              <input type="text" value={editStaff.role} onChange={(e) => setEditStaff({ ...editStaff, role: e.target.value })} />
              <label>Status</label>
              <select value={editStaff.status} onChange={(e) => setEditStaff({ ...editStaff, status: e.target.value as Staff["status"] })}>
                <option value="active">Active</option>
                <option value="on-leave">On Leave</option>
                <option value="unpaid">Unpaid</option>
              </select>
              <label>Join Date</label>
              <input type="date" value={editStaff.joinDate} onChange={(e) => setEditStaff({ ...editStaff, joinDate: e.target.value })} />
              <label>Gender</label>
              <select value={editStaff.gender} onChange={(e) => setEditStaff({ ...editStaff, gender: e.target.value as Staff["gender"] })}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <label>NRC</label>
              <input type="text" value={editStaff.NRC} onChange={(e) => setEditStaff({ ...editStaff, NRC: e.target.value })} />
              <label>Address</label>
              <input type="text" value={editStaff.address} onChange={(e) => setEditStaff({ ...editStaff, address: e.target.value })} />
              <label>Phone</label>
              <input type="text" value={editStaff.phone} onChange={(e) => setEditStaff({ ...editStaff, phone: e.target.value })} />
              <label>Email</label>
              <input type="email" value={editStaff.email} onChange={(e) => setEditStaff({ ...editStaff, email: e.target.value })} />
              <label>Photo URL</label>
              <input type="text" value={editStaff.photo} onChange={(e) => setEditStaff({ ...editStaff, photo: e.target.value })} />
              <div className="filter-popup-buttons">
                <button className="add-btn" onClick={() => handleSaveStaff(editStaff)}>Save</button>
                <button className="delete-btn" onClick={closeEditModal}>Close</button>
              </div>
            </div>
          </>
        )}

        {/* View Modal */}
        {viewStaff && (
          <>
            <div className="overlay" onClick={closeViewModal}></div>
            <div className="filter-popup modal-wide">
              <h3>Staff Profile</h3>
              <table className="responsive-table view-table">
                <tbody>
                  <tr><td>Photo</td><td><img src={viewStaff.photo} style={{ maxWidth: 120 }} /></td></tr>
                  <tr><td>Name</td><td>{viewStaff.name}</td></tr>
                  <tr><td>Department</td><td>{viewStaff.department}</td></tr>
                  <tr><td>Role</td><td>{viewStaff.role}</td></tr>
                  <tr><td>Status</td><td>{viewStaff.status.replace("-", " ")}</td></tr>
                  <tr><td>Payment</td><td>{viewStaff.paid ? "Paid Staff" : "Unpaid / Volunteer"}</td></tr>
                  <tr><td>Join Date</td><td>{viewStaff.joinDate}</td></tr>
                  <tr><td>Gender</td><td>{viewStaff.gender}</td></tr>
                  <tr><td>NRC</td><td>{viewStaff.NRC}</td></tr>
                  <tr><td>Address</td><td>{viewStaff.address}</td></tr>
                  <tr><td>Phone</td><td>{viewStaff.phone}</td></tr>
                  <tr><td>Email</td><td>{viewStaff.email}</td></tr>
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

export default StaffDirectoryPage;
