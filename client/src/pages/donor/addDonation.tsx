import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

interface Donation {
  donorRegistered: boolean | null;
  donorType: string;
  donorName: string;
  donorPhone: string;
  donorEmail: string;
  subcategory: string;
  date: string;
  amount: number | null;
  method: string;
  purpose: string;
  notes: string;
  isAnonymous: string;
}

const AddDonation: React.FC = () => {
  const navigate = useNavigate();

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    document.body.classList.toggle("sidebar-open", sidebarOpen);
  }, [sidebarOpen]);

  // Form state
  const [form, setForm] = useState<Donation>({
    donorRegistered: null,
    donorType: "",
    donorName: "",
    donorPhone: "",
    donorEmail: "",
    subcategory: "",
    date: "",
    amount: null,
    method: "",
    purpose: "",
    notes: "",
    isAnonymous: "",
  });

  // Subcategory options
  const subcategoryOptions: Record<string, string[]> = {
    individual: ["Regular", "Occasional", "One-time"],
    organization: ["Silver", "Gold", "Platinum"],
  };

  // Filter donor names for registered donors
  const registeredDonors = {
    individual: ["John Doe", "Mary Akoto"],
    organization: ["Grace Foundation", "Hope Corp"],
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Donation submitted:", form);
    alert("Donation will be submitted to the database once backend is ready.");
  };

  return (
    <div className="dashboard-wrapper">
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

        <h2>FINANCE</h2>
        <a href="/donor/dashboard">Dashboard</a>
        <a href="/donor/donors">Donors</a>
        <a href="/donor/donations" className="active">Donations</a>
        <a href="/donor/reports">Reports</a>

        <hr className="sidebar-separator" />
        <a href="/dashboard" className="return-main">
          ← Back to Main Dashboard
        </a>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        <header className="page-header">
          <h1>Add Donation</h1>
          <button
            className="hamburger"
            onClick={toggleSidebar}
            style={{ marginLeft: "10px" }}
          >
            &#9776;
          </button>
        </header>

        <div className="container">
          <form className="add-form-styling" onSubmit={handleSubmit}>
            {/* Registered Donor */}
            <label>Registered Donor?</label>
            <select
              required
              value={form.donorRegistered === null ? "" : form.donorRegistered ? "true" : "false"}
              onChange={(e) => setForm({
                ...form,
                donorRegistered: e.target.value === "true",
                donorType: "",
                donorName: "",
                subcategory: "",
                donorPhone: "",
                donorEmail: "",
                isAnonymous: "",
              })}
            >
              <option value="">Select</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>

            {/* Registered Donor Type */}
            {form.donorRegistered && (
              <>
                <label>Donor Type</label>
                <select
                  value={form.donorType}
                  onChange={(e) => setForm({
                    ...form,
                    donorType: e.target.value,
                    donorName: "",
                    subcategory: "",
                  })}
                >
                  <option value="">Select</option>
                  <option value="individual">Individual</option>
                  <option value="organization">Organization</option>
                </select>

                {/* Registered Donor Name */}
                {form.donorType && (
                  <>
                    <label>Donor Name</label>
                    <select
                      value={form.donorName}
                      onChange={(e) => setForm({ ...form, donorName: e.target.value })}
                    >
                      <option value="">Select Donor</option>
                      {registeredDonors[form.donorType].map((name) => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>

                    {/* Registered Subcategory */}
                    <label>Donor Subcategory</label>
                    <select
                      value={form.subcategory}
                      onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                    >
                      <option value="">Select Subcategory</option>
                      {subcategoryOptions[form.donorType].map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </>
                )}
              </>
            )}

            {/* Unregistered Donor */}
            {form.donorRegistered === false && (
              <>
                <label>Anonymous Donor?</label>
                <select
                  value={form.isAnonymous}
                  onChange={(e) => setForm({
                    ...form,
                    isAnonymous: e.target.value,
                    donorType: "",
                    donorName: "",
                    donorPhone: "",
                    donorEmail: "",
                    subcategory: "",
                  })}
                >
                  <option value="">Select</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>

                {form.isAnonymous === "false" && (
                  <>
                    <label>Donor Type</label>
                    <select
                      value={form.donorType}
                      onChange={(e) => setForm({ ...form, donorType: e.target.value })}
                    >
                      <option value="">Select</option>
                      <option value="individual">Individual</option>
                      <option value="organization">Organization</option>
                    </select>

                    <label>Donor Name</label>
                    <input
                      type="text"
                      placeholder="Enter donor name"
                      value={form.donorName}
                      onChange={(e) => setForm({ ...form, donorName: e.target.value })}
                    />

                    <label>Phone Number</label>
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      value={form.donorPhone}
                      onChange={(e) => setForm({ ...form, donorPhone: e.target.value })}
                    />

                    <label>Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter email address"
                      value={form.donorEmail}
                      onChange={(e) => setForm({ ...form, donorEmail: e.target.value })}
                    />

                    <label>Donor Category</label>
                    <select
                      value={form.subcategory}
                      onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                    >
                      <option value="">Select Subcategory</option>
                      {form.donorType && subcategoryOptions[form.donorType].map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </>
                )}
              </>
            )}

            {/* Donation Details */}
            <label>Donation Date</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />

            <label>Amount ($)</label>
            <input
              type="number"
              required
              value={form.amount ?? ""}
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value ? Number(e.target.value) : null })
              }
              placeholder="Enter amount"
            />

            <label>Payment Method</label>
            <select
              required
              value={form.method}
              onChange={(e) => setForm({ ...form, method: e.target.value })}
            >
              <option value="">Select Payment Method</option>
              <option>Cash</option>
              <option>Bank Transfer</option>
              <option>Mobile Money</option>
              <option>Check</option>
            </select>

            <label>Purpose of Donation</label>
            <select
              required
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
            >
              <option value="">Select Purpose</option>
              <option value="tithes">Tithes</option>
              <option value="offering">Offering</option>
              <option value="specialFund">Special Fund</option>
              <option value="disasterRelief">Disaster Relief</option>
              <option value="other">Other</option>
            </select>

            <label>Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              placeholder="Enter any additional notes"
            />

            <div className="form-buttons">
              <button type="submit" className="add-btn">Add Donation</button>
              <button type="button" className="cancel-btn" onClick={() => navigate("/donor/donations")}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDonation;
