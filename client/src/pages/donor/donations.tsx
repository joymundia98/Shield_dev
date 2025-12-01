import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

interface Donation {
  id: string;
  donor: string;
  registered: boolean;
  date: string;
  amount: number;
  type: string;
  method: string;
}

const DonationsManagementPage: React.FC = () => {
  const navigate = useNavigate();

  /* ---------------- SIDEBAR ---------------- */
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    if (sidebarOpen) document.body.classList.add("sidebar-open");
    else document.body.classList.remove("sidebar-open");
  }, [sidebarOpen]);

  /* ---------------- STATIC TEMP DONATION DATA ---------------- */
  const [donationData] = useState<Donation[]>([
    {
      id: "DN001",
      donor: "John Doe",
      registered: true,
      date: "2025-11-15",
      amount: 500,
      type: "Widows Contributions",
      method: "Cash",
    },
    {
      id: "DN002",
      donor: "Acme Corp.",
      registered: true,
      date: "2025-11-16",
      amount: 2000,
      type: "Special Fund",
      method: "Bank Transfer",
    },
    {
      id: "DN003",
      donor: "Walk-in Guest",
      registered: false,
      date: "2025-11-18",
      amount: 150,
      type: "Disaster Relief",
      method: "Cash",
    },
  ]);

  /* ---------------- SEARCH ---------------- */
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDonations = useMemo(() => {
    return donationData.filter((d) =>
      `${d.id} ${d.donor} ${d.type} ${d.method}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [donationData, searchQuery]);

  /* ---------------- GROUPING ---------------- */
  const donationGroups = useMemo(() => {
    return {
      "Registered Donors": filteredDonations.filter((d) => d.registered),
      "Unregistered Donors": filteredDonations.filter((d) => !d.registered),
    };
  }, [filteredDonations]);

  /* ---------------- VIEW MODAL ---------------- */
  const [viewItem, setViewItem] = useState<Donation | null>(null);
  const closeViewModal = () => setViewItem(null);

  /* ---------------- REDIRECT ---------------- */
  const handleAddDonation = () => {
    navigate("/donor/addDonation");
  };

  return (
    <div className="dashboard-wrapper">
      {/* Hamburger */}
      <button className="hamburger" onClick={toggleSidebar}>
        &#9776;
      </button>

      {/* SIDEBAR */}
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

        <h2>DONOR MANAGER</h2>

        <a href="/donor/dashboard">Dashboard</a>
        <a href="/donor/donors">Donors</a>
        <a href="/donor/donations" className="active">Donations</a>
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
          ➜] Logout
        </a>
      </div>

      {/* MAIN CONTENT */}
      <div className="dashboard-content">
        <h1>Donations</h1>
        <br />

        {/* Search + Add */}
        <div
          className="table-header"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <input
            type="text"
            className="search-input"
            placeholder="Search donations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <button className="add-btn" onClick={handleAddDonation}>
            + Add Donation
          </button>
        </div>

        {/* Donation Groups */}
        {Object.entries(donationGroups).map(([groupName, records]) => (
          <div className="department-block" key={groupName}>
            <h2>{groupName}</h2>

            <table className="responsive-table">
              <thead>
                <tr>
                  <th>Donation ID</th>
                  <th>Donor</th>
                  <th>Date</th>
                  <th>Amount ($)</th>
                  <th>Type</th>
                  <th>Payment Method</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {records.map((d, i) => (
                  <tr key={i}>
                    <td>{d.id}</td>
                    <td>{d.donor}</td>
                    <td>{d.date}</td>
                    <td>{d.amount}</td>
                    <td>{d.type}</td>
                    <td>{d.method}</td>
                    <td className="actions">
                      <button className="add-btn" onClick={() => setViewItem(d)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        {/* VIEW MODAL */}
        {viewItem && (
          <>
            <div className="overlay" onClick={closeViewModal}></div>

            <div className="filter-popup modal-wide">
              <h3>Donation Details</h3>

              <table className="responsive-table view-table">
                <tbody>
                  <tr><td>Donation ID</td><td>{viewItem.id}</td></tr>
                  <tr><td>Donor</td><td>{viewItem.donor}</td></tr>
                  <tr><td>Registered</td><td>{viewItem.registered ? "Yes" : "No"}</td></tr>
                  <tr><td>Date</td><td>{viewItem.date}</td></tr>
                  <tr><td>Amount</td><td>${viewItem.amount}</td></tr>
                  <tr><td>Type</td><td>{viewItem.type}</td></tr>
                  <tr><td>Payment Method</td><td>{viewItem.method}</td></tr>
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

export default DonationsManagementPage;
