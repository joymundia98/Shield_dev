import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

interface ExpenseItem {
  date: string;
  department: string;
  description: string;
  amount: number;
  status: "Pending" | "Approved" | "Rejected";
}

interface ExpenseGroup {
  name: string;
  items: ExpenseItem[];
}

interface ExpenseCategories {
  [category: string]: ExpenseGroup[];
}

const ExpenseTrackerPage: React.FC = () => {
  const navigate = useNavigate();

  // ------------------- Sidebar -------------------
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    if (sidebarOpen) document.body.classList.add("sidebar-open");
    else document.body.classList.remove("sidebar-open");
  }, [sidebarOpen]);

  // ------------------- Categories & Items -------------------
  const [categories, setCategories] = useState<ExpenseCategories>({
    "Operational Expenses": [
      {
        name: "Rent",
        items: [
          {
            date: "2025-11-01",
            department: "Finance",
            description: "Office Rent",
            amount: 5000,
            status: "Pending"
          }
        ]
      },
      {
        name: "Utilities",
        items: [
          {
            date: "2025-11-05",
            department: "Operations",
            description: "Electricity",
            amount: 800,
            status: "Pending"
          }
        ]
      },
      {
        name: "Office Supplies",
        items: [
          {
            date: "2025-11-06",
            department: "Admin",
            description: "Stationery",
            amount: 150,
            status: "Pending"
          }
        ]
      },
      {
        name: "Equipment & Software",
        items: [
          {
            date: "2025-11-07",
            department: "IT",
            description: "Software Subscription",
            amount: 400,
            status: "Pending"
          }
        ]
      }
    ],
    "Employee Expenses": [
      {
        name: "Salaries & Wages",
        items: [
          {
            date: "2025-11-10",
            department: "Finance",
            description: "Salary",
            amount: 1500,
            status: "Pending"
          }
        ]
      },
      {
        name: "Reimbursements",
        items: [
          {
            date: "2025-11-05",
            department: "Admin",
            description: "Travel Reimbursement",
            amount: 300,
            status: "Pending"
          }
        ]
      }
    ],
    "Project / Department Expenses": [
      {
        name: "Project Costs",
        items: [
          {
            date: "2025-11-07",
            department: "Project A",
            description: "Consultant Fee",
            amount: 1500,
            status: "Pending"
          }
        ]
      },
      { name: "Materials / Consultants / Outsourcing", items: [] }
    ],
    "Financial & Regulatory Expenses": [
      {
        name: "Taxes, Fees, Insurance",
        items: [
          {
            date: "2025-11-08",
            department: "Finance",
            description: "Insurance Payment",
            amount: 1200,
            status: "Pending"
          }
        ]
      },
      { name: "Compliance Costs", items: [] }
    ],
    "Capital Expenses": [
      {
        name: "Investments / Assets",
        items: [
          {
            date: "2025-11-08",
            department: "Operations",
            description: "New Server Purchase",
            amount: 12000,
            status: "Pending"
          },
          {
            date: "2025-11-10",
            department: "Logistics",
            description: "Delivery Van",
            amount: 25000,
            status: "Pending"
          }
        ]
      }
    ]
  });

  // ------------------- Category Filter -------------------
  const [selectedFilter, setSelectedFilter] = useState("All");

  // ------------------- Modal -------------------
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

  // ------------------- Approve / Reject Logic -------------------
  const updateStatus = (
    catName: string,
    groupName: string,
    index: number,
    status: "Approved" | "Rejected"
  ) => {
    setCategories(prev => {
      const updated = { ...prev };
      const group = updated[catName].find(g => g.name === groupName);
      if (group) group.items[index].status = status;
      return updated;
    });
  };

  // ------------------- KPI Calculations -------------------
  const { totalApproved, totalPending, totalRejected } = useMemo(() => {
    let approved = 0,
      pending = 0,
      rejected = 0;

    Object.values(categories).forEach(groups =>
      groups.forEach(g =>
        g.items.forEach(item => {
          if (item.status === "Approved") approved += item.amount;
          if (item.status === "Pending") pending += item.amount;
          if (item.status === "Rejected") rejected += item.amount;
        })
      )
    );

    return {
      totalApproved: approved,
      totalPending: pending,
      totalRejected: rejected
    };
  }, [categories]);

  // ------------------- Filtered Rendering -------------------
  const filteredCategories = useMemo(() => {
    if (selectedFilter === "All") return categories;
    return { [selectedFilter]: categories[selectedFilter] };
  }, [categories, selectedFilter]);

  return (
    <div className="dashboard-wrapper">

      {/* Sidebar */}
      <div
        className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}
        id="sidebar"
      >
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

        <h2>FINANCE</h2>
        <a href="/finance/dashboard">Dashboard</a>
        <a href="/finance/add-transaction">Add Transaction</a>
        <a href="/finance/expensetracker" className="active">Track Expenses</a>
        <a href="/finance/expenses">Expenses</a>
        <a href="/finance/payroll">Payroll</a>
        <a href="/finance/reports">Reports</a>
        <a href="/finance/budgets">Budgets</a>

        <hr className="sidebar-separator" />
        <a href="/dashboard" className="return-main">
          ← Back to Main Dashboard
        </a>
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

        {/* HEADER  */}
        <header className="page-header expense-header">
          <h1>Expense Tracker</h1>

          <div>
            <br/><br/>
            <button
              className="add-btn"
              style={{ marginRight: "10px" }}
              onClick={() => navigate("/finance/expenseDashboard")}
            >
              View Summary
            </button>

            <button className="hamburger" onClick={toggleSidebar}>
              &#9776;
            </button>
          </div>
        </header>

        <br/><br/>
        {/* KPI Cards */}
        <div className="kpi-container">
          <div className="kpi-card kpi-approved">
            <h3>Total Approved Expenses</h3>
            <p>${totalApproved.toLocaleString()}</p>
          </div>
          <div className="kpi-card kpi-pending">
            <h3>Total Pending Expenses</h3>
            <p>${totalPending.toLocaleString()}</p>
          </div>
          <div className="kpi-card kpi-rejected">
            <h3>Total Rejected Expenses</h3>
            <p>${totalRejected.toLocaleString()}</p>
          </div>
        </div>

        {/* Add Expense Button */}
        <button
          className="add-btn"
          onClick={() => navigate("/expenses/add")}
          style={{ margin: "10px 0" }}
        >
          + Add Expense
        </button>

        {/* Filters */}
        <div
          className="expense-filter-box"
          style={{
            margin: "20px 0",
            padding: "10px",
            background: "#f5f5f5",
            borderRadius: "6px"
          }}
        >
          <h3>Filter by Category</h3>

          {[
            "All",
            "Operational Expenses",
            "Employee Expenses",
            "Project / Department Expenses",
            "Financial & Regulatory Expenses",
            "Capital Expenses"
          ].map(cat => (
            <label key={cat} style={{ display: "block" }}>
              <input
                type="radio"
                name="expenseFilter"
                value={cat}
                checked={selectedFilter === cat}
                onChange={e => setSelectedFilter(e.target.value)}
              />{" "}
              {cat}
            </label>
          ))}
        </div>

        {/* Expense Tables */}
        {Object.entries(filteredCategories).map(([catName, groups]) => (
          <div key={catName}>
            <h2>{catName}</h2>
            {groups.map(group => (
              <div key={group.name}>
                {group.items.length > 0 && <h3>{group.name}</h3>}
                {group.items.length > 0 && (
                  <table className="responsive-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Department/Project</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {group.items.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.date}</td>
                          <td>{item.department}</td>
                          <td>{item.description}</td>
                          <td>${item.amount.toLocaleString()}</td>
                          <td>
                            <span className={`status ${item.status}`}>
                              {item.status}
                            </span>
                          </td>
                          <td>
                            {item.status === "Pending" && (
                              <>
                                <button
                                  className="approve-btn"
                                  onClick={() =>
                                    openModal(
                                      () =>
                                        updateStatus(
                                          catName,
                                          group.name,
                                          idx,
                                          "Approved"
                                        ),
                                      "approve"
                                    )
                                  }
                                >
                                  Approve
                                </button>&nbsp;&nbsp;
                                <button
                                  className="reject-btn"
                                  onClick={() =>
                                    openModal(
                                      () =>
                                        updateStatus(
                                          catName,
                                          group.name,
                                          idx,
                                          "Rejected"
                                        ),
                                      "reject"
                                    )
                                  }
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ))}
          </div>
        ))}

        {/* Modal */}
        {modalOpen && (
          <div className="expenseModal" style={{ display: "flex" }}>
            <div className="expenseModal-content">
              <h2>
                {modalType === "approve" ? "Approve Expense?" : "Reject Expense?"}
              </h2>

              <p>This action cannot be undone.</p>

              <div className="expenseModal-buttons">
                <button
                  className="expenseModal-cancel"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className={`expenseModal-confirm ${
                    modalType === "reject" ? "reject" : ""
                  }`}
                  onClick={confirmModal}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseTrackerPage;
