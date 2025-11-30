import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

interface IncomeItem {
  date: string;
  giver: string;
  description: string;
  amount: number;
  status: "Pending" | "Approved" | "Rejected";
  attachments?: { url: string; type: string }[];
  extraFields?: Record<string, string>;
}

interface IncomeGroup {
  name: string;
  items: IncomeItem[];
}

interface IncomeCategories {
  [category: string]: IncomeGroup[];
}

const IncomeTrackerPage: React.FC = () => {
  const navigate = useNavigate();

  // ------------------- Sidebar -------------------
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    if (sidebarOpen) document.body.classList.add("sidebar-open");
    else document.body.classList.remove("sidebar-open");
  }, [sidebarOpen]);

  // ------------------- Categories & Items -------------------
  const [categories, setCategories] = useState<IncomeCategories>({
    "Tithes & Regular Giving": [
      {
        name: "Tithes",
        items: [
          { date: "2025-11-01", giver: "John Doe", description: "Monthly tithe", amount: 200, status: "Pending" },
          { date: "2025-11-02", giver: "Mary Jane", description: "Monthly tithe", amount: 180, status: "Pending" }
        ]
      },
      {
        name: "General Offering",
        items: [
          { date: "2025-11-03", giver: "Jane Smith", description: "Sunday offering", amount: 150, status: "Pending" },
          { date: "2025-11-04", giver: "Church Online", description: "Digital offering", amount: 220, status: "Pending" }
        ]
      }
    ],
    "Special Offerings": [
      { name: "Thanksgiving Offering", items: [{ date: "2025-11-10", giver: "Missions Ministry", description: "Annual thanksgiving", amount: 400, status: "Pending" }] },
      { name: "Building Fund Offering", items: [{ date: "2025-11-11", giver: "John Doe", description: "Church building", amount: 500, status: "Pending" }] }
    ]
  });

  // ------------------- Category Filter -------------------
  const [selectedFilter, setSelectedFilter] = useState("All");

  // ------------------- Approve / Reject Modal -------------------
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"approve" | "reject">("approve");
  const [modalAction, setModalAction] = useState<() => void>(() => {});

  const openModal = (action: () => void, type: "approve" | "reject") => {
    setModalAction(() => action);
    setModalType(type);
    setModalOpen(true);
  };

  const confirmModal = () => {
    modalAction();
    setModalOpen(false);
  };

  // ------------------- View Details Modal -------------------
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewRecord, setViewRecord] = useState<IncomeItem | null>(null);

  const openViewModal = (item: IncomeItem) => {
    setViewRecord(item);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setViewRecord(null);
    setViewModalOpen(false);
  };

  // ------------------- Approve / Reject Logic -------------------
  const updateStatus = (catName: string, groupName: string, index: number, status: "Approved" | "Rejected") => {
    setCategories(prev => {
      const updated = { ...prev };
      const group = updated[catName]?.find(g => g.name === groupName);
      if (group) group.items[index].status = status;
      return updated;
    });
  };

  // ------------------- KPI Calculations -------------------
  const { totalApproved, totalPending, totalRejected } = useMemo(() => {
    let approved = 0, pending = 0, rejected = 0;

    Object.values(categories).forEach(groups =>
      groups.forEach(g =>
        g.items.forEach(item => {
          if (item.status === "Approved") approved += item.amount;
          if (item.status === "Pending") pending += item.amount;
          if (item.status === "Rejected") rejected += item.amount;
        })
      )
    );

    return { totalApproved: approved, totalPending: pending, totalRejected: rejected };
  }, [categories]);

  // ------------------- Filtered Rendering -------------------
  const filteredCategories = useMemo(() => {
    if (selectedFilter === "All") return categories;
    return { [selectedFilter]: categories[selectedFilter] || [] };
  }, [categories, selectedFilter]);

  // ------------------- Render -------------------
  return (
    <div className="dashboard-wrapper">

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`} id="sidebar">
        <div className="close-wrapper">
          <div className="toggle close-btn">
            <input type="checkbox" checked={sidebarOpen} onChange={toggleSidebar} />
            <span className="button"></span>
            <span className="label">X</span>
          </div>
        </div>

        <h2>FINANCE</h2>
        <a href="/finance/dashboard">Dashboard</a>
        <a href="/finance/incometracker" className="active">Track Income</a>
        <a href="/finance/expensetracker">Track Expenses</a>
        <a href="/finance/budgets">Budget</a>
        <a href="/finance/payroll">Payroll</a>
        <a href="/finance/financeCategory">Finance Categories</a>

        <hr className="sidebar-separator" />
        <a href="/dashboard" className="return-main">← Back to Main Dashboard</a>
        <a
          href="/"
          className="logout-link"
          onClick={e => {
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

        {/* HEADER */}
        <header className="page-header income-header">
          <h1>Church Income Tracker</h1>

          <div>
            <br /><br />
            <button className="add-btn" style={{ marginRight: "10px" }} onClick={() => navigate("/finance/incomeDashboard")}>
              View Summary
            </button>

            <button className="hamburger" onClick={toggleSidebar}>
              &#9776;
            </button>
          </div>
        </header>

        <br /><br />
        {/* KPI Cards */}
        <div className="kpi-container">
          <div className="kpi-card kpi-approved">
            <h3>Total Approved Income</h3>
            <p>${totalApproved.toLocaleString()}</p>
          </div>
          <div className="kpi-card kpi-pending">
            <h3>Total Pending Income</h3>
            <p>${totalPending.toLocaleString()}</p>
          </div>
          <div className="kpi-card kpi-rejected">
            <h3>Total Rejected Income</h3>
            <p>${totalRejected.toLocaleString()}</p>
          </div>
        </div>

        {/* Add Income Button */}
        <button className="add-btn" onClick={() => navigate("/finance/addIncome")} style={{ margin: "10px 0" }}>
          + Add Income
        </button>

        {/* Filters */}
        <div className="income-filter-box">
          <h3>Filter by Category</h3>
          <select className="income-filter-select" value={selectedFilter} onChange={e => setSelectedFilter(e.target.value)}>
            {["All", "Tithes & Regular Giving", "Special Offerings", "Event-Based Income", "Functional Fees / Services", "Donations", "Pledges", "Fundraising Campaigns", "Grants"].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Income Tables */}
        {Object.entries(filteredCategories).map(([catName, groups]) => (
          <div key={catName}>
            <h2>{catName}</h2>
            {groups.length > 0 ? (
              groups.map(group => (
                <div key={group.name}>
                  <h3>{group.name}</h3>
                  <table className="responsive-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Source/Giver</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.items.length > 0 ? (
                        group.items.map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.date}</td>
                            <td>{item.giver}</td>
                            <td>{item.description}</td>
                            <td>${item.amount.toLocaleString()}</td>
                            <td><span className={`status ${item.status}`}>{item.status}</span></td>
                            <td>
                              <button className="add-btn" onClick={() => openViewModal(item)}>View</button>&nbsp;&nbsp;
                              {item.status === "Pending" && (
                                <>
                                  <button className="approve-btn" onClick={() => openModal(() => updateStatus(catName, group.name, idx, "Approved"), "approve")}>Approve</button>&nbsp;&nbsp;
                                  <button className="reject-btn" onClick={() => openModal(() => updateStatus(catName, group.name, idx, "Rejected"), "reject")}>Reject</button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} style={{ textAlign: "center", fontStyle: "italic" }}>No items</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ))
            ) : (
              <div>
                <h3>No groups</h3>
                <table className="responsive-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Source/Giver</th>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", fontStyle: "italic" }}>No items</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}

        {/* Approve/Reject Modal */}
        {modalOpen && (
          <div className="incomeModal" style={{ display: "flex" }}>
            <div className="incomeModal-content">
              <h2>{modalType === "approve" ? "Approve Income?" : "Reject Income?"}</h2>
              <p>This action cannot be undone.</p>
              <div className="incomeModal-buttons">
                <button className="incomeModal-cancel" onClick={() => setModalOpen(false)}>Cancel</button>
                <button className={`incomeModal-confirm ${modalType === "reject" ? "reject" : ""}`} onClick={confirmModal}>Confirm</button>
              </div>
            </div>
          </div>
        )}

        {/* View Details Modal */}
        {viewModalOpen && viewRecord && (
          <div className="incomeModal" style={{ display: "flex" }} onClick={closeViewModal}>
            <div className="incomeModal-content" onClick={e => e.stopPropagation()}>
              <h2>Income Details</h2>
              <table>
                <tbody>
                  <tr><th>Date</th><td>{viewRecord.date}</td></tr>
                  <tr><th>Source / Giver</th><td>{viewRecord.giver}</td></tr>
                  <tr><th>Description</th><td>{viewRecord.description}</td></tr>
                  <tr><th>Amount</th><td>${viewRecord.amount.toLocaleString()}</td></tr>
                  <tr><th>Status</th><td>{viewRecord.status}</td></tr>
                  {viewRecord.extraFields && Object.entries(viewRecord.extraFields).map(([key, val]) => (
                    <tr key={key}><th>{key}</th><td>{val}</td></tr>
                  ))}
                  {viewRecord.attachments && viewRecord.attachments.length > 0 && (
                    <tr>
                      <th>Attachments</th>
                      <td>
                        {viewRecord.attachments.map((file, idx) => (
                          <a key={idx} href={file.url} target="_blank" rel="noopener noreferrer">
                            {file.type === "application/pdf" ? "View PDF" : "View File"}
                          </a>
                        ))}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <button className="incomeModal-cancel" onClick={closeViewModal}>Close</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default IncomeTrackerPage;
