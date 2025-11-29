import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

interface ExtraFields {
  [key: string]: string | number;
}

interface NewIncome {
  category: string;
  subcategory: string;
  date: string;
  source: string;
  description: string;
  amount: number;
  paymentMethod: string;
  attachments: File[];
  extraFields: ExtraFields;
}

const incomeMap: Record<string, string[]> = {
  "Tithes & Regular Giving": ["Tithes", "General Offering", "Digital Giving"],
  "Special Offerings": ["Thanksgiving Offering", "Building Fund Offering", "Mission Offering", "Pastor Appreciation", "Love Offering"],
  "Event-Based Income": ["Conferences", "Workshops/Seminars", "Fundraising Events", "Concerts", "Banquets/Galas"],
  "Functional Fees / Services": ["Weddings", "Funerals", "Baptisms", "Facility Usage Fees", "Counseling Fees"],
  "Donations": ["One-time Donations", "Anonymous Donations", "Major Donor Gifts", "Memorial Gifts", "In-kind Donations"],
  "Pledges": ["Building Project Pledges", "Mission Pledges", "Annual Contribution Pledges"],
  "Fundraising Campaigns": ["Capital Campaigns", "Crowdfunding/Online Campaigns", "Sales Drives"],
  "Grants": ["Local Government Grants", "Nonprofit Foundation Grants", "International Ministry Grants", "Community Service Grants"],
  "Business or Investment Income": ["Business Profits", "Investment Returns", "Rental Income", "Asset Sales"],
  "Membership-Based Contributions": ["Membership Dues", "Partner Contributions", "Annual Membership Fees"],
  "External Support": ["Mission Support", "Partner Church Support", "International Support"],
  "Miscellaneous / Other Income": ["Miscellaneous Income", "Other"]
};

const AddIncome: React.FC = () => {
  const navigate = useNavigate();

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    document.body.classList.toggle("sidebar-open", sidebarOpen);
  }, [sidebarOpen]);

  // Form state
  const [form, setForm] = useState<NewIncome>({
    category: "",
    subcategory: "",
    date: "",
    source: "",
    description: "",
    amount: 0,
    paymentMethod: "Cash",
    attachments: [],
    extraFields: {},
  });

  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [showDonorPopup, setShowDonorPopup] = useState(false);

  const handleCategoryChange = (cat: string) => {
    if (cat === "Donations") {
      setShowDonorPopup(true);
      setForm({ ...form, category: "", subcategory: "", extraFields: {} });
      setSubcategories([]);
    } else {
      setForm({ ...form, category: cat, subcategory: "", extraFields: {} });
      setSubcategories(incomeMap[cat] || []);
    }
  };

  const handleSubcategoryChange = (sub: string) => {
    setForm({ ...form, subcategory: sub, extraFields: {} });
  };

  const handleExtraFieldChange = (key: string, value: string | number) => {
    setForm({ ...form, extraFields: { ...form.extraFields, [key]: value } });
  };

  const handleAttachments = (files: FileList | null) => {
    if (!files) return;
    setForm({ ...form, attachments: Array.from(files) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted income:", form);
    alert("Income submitted successfully!");
    navigate("/finance/incometracker");
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="close-wrapper">
          <div className="toggle close-btn">
            <input type="checkbox" checked={sidebarOpen} onChange={toggleSidebar} />
            <span className="button"></span>
            <span className="label">X</span>
          </div>
        </div>

        <h2>INCOME</h2>
        <a href="/finance/dashboard">Dashboard</a>
        <a href="/finance/incometracker" className="active">Track Income</a>
        <a href="/finance/expensetracker">Track Expenses</a>
        <a href="/finance/budgets">Budget</a>
        <a href="/finance/payroll">Payroll</a>
        <a href="/finance/financeCategory">Finance Categories</a>

        <hr className="sidebar-separator" />
        <a href="/dashboard" className="return-main">← Back to Main Dashboard</a>
        <a href="/" className="logout-link" onClick={(e) => { e.preventDefault(); localStorage.clear(); navigate("/"); }}>➜ Logout</a>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        <header className="page-header income-header">
          <h1>Add Income</h1>
          <div>
            <button className="add-btn" style={{ margin: "10px 0" }} onClick={() => navigate("/finance/incometracker")}>
              ← Back
            </button>
            <button className="hamburger" onClick={toggleSidebar}>
              &#9776;
            </button>
          </div>
        </header>

        <div className="container">
          <h2 style={{ marginBottom: 20, textAlign: "center" }}>New Income Entry</h2>

          <form className="add-form-styling" onSubmit={handleSubmit}>
            {/* Category */}
            <label>Income Category</label>
            <select value={form.category} required onChange={(e) => handleCategoryChange(e.target.value)}>
              <option value="">Select Category</option>
              {Object.keys(incomeMap).map(cat => <option key={cat}>{cat}</option>)}
            </select>

            {/* Subcategory */}
            <label>Subcategory</label>
            <select value={form.subcategory} required onChange={(e) => handleSubcategoryChange(e.target.value)}>
              <option value="">Select Subcategory</option>
              {subcategories.map(sub => <option key={sub}>{sub}</option>)}
            </select>

            {/* Date */}
            <label>Income Date</label>
            <input type="date" value={form.date} required onChange={(e) => setForm({ ...form, date: e.target.value })} />

            {/* Source */}
            <label>Source / Giver</label>
            <input type="text" value={form.source} placeholder="e.g. John Doe, Online Donor" required
              onChange={(e) => setForm({ ...form, source: e.target.value })} />

            {/* Description */}
            <label>Description</label>
            <textarea value={form.description} placeholder="What is this income for?" required
              onChange={(e) => setForm({ ...form, description: e.target.value })} />

            {/* Amount */}
            <label>Amount ($)</label>
            <input type="number" min={0} step={0.01} required value={form.amount}
              onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) })} />

            {/* Payment Method */}
            <label>Payment Method</label>
            <select value={form.paymentMethod} required onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}>
              <option>Cash</option>
              <option>Bank Transfer</option>
              <option>POS</option>
              <option>Mobile Money</option>
              <option>Cheque</option>
              <option>Online Giving Platform</option>
            </select>

            {/* Attachments */}
            <label>Upload Documents / Receipts</label>
            <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={(e) => handleAttachments(e.target.files)} />
            <p className="small-note">Attach offering slips, receipts, bank proof, or donation confirmation.</p>

            {/* Dynamic Extra Fields */}
            {["Conferences", "Workshops/Seminars", "Fundraising Events", "Concerts", "Banquets/Galas"].includes(form.subcategory) && (
              <>
                <label>Event Name</label>
                <input type="text" placeholder="e.g. Youth Conference 2025"
                  value={form.extraFields.eventName || ""} onChange={(e) => handleExtraFieldChange("eventName", e.target.value)} />
              </>
            )}

            {["Building Project Pledges", "Mission Pledges", "Annual Contribution Pledges"].includes(form.subcategory) && (
              <>
                <label>Pledge Year</label>
                <input type="number" placeholder="e.g. 2025"
                  value={form.extraFields.pledgeYear || ""} onChange={(e) => handleExtraFieldChange("pledgeYear", e.target.value)} />
              </>
            )}

            {form.subcategory === "Major Donor Gifts" && (
              <>
                <label>Donor Tier</label>
                <select value={form.extraFields.donorTier || ""} onChange={(e) => handleExtraFieldChange("donorTier", e.target.value)}>
                  <option>Bronze</option>
                  <option>Silver</option>
                  <option>Gold</option>
                  <option>Platinum</option>
                </select>
              </>
            )}

            {["Local Government Grants", "Nonprofit Foundation Grants", "International Ministry Grants", "Community Service Grants"].includes(form.subcategory) && (
              <>
                <label>Grant Reference Number</label>
                <input type="text" placeholder="e.g. GRANT-2025/001"
                  value={form.extraFields.grantReference || ""} onChange={(e) => handleExtraFieldChange("grantReference", e.target.value)} />
              </>
            )}

            <button type="submit" className="add-btn" style={{ marginTop: 20 }}>Submit Income</button>
          </form>
        </div>
      </div>

      {/* Donor Popup */}
      {showDonorPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Redirect Notice</h3>
            <p>You are about to be redirected to the Donor Management platform because donations are handled there. Do you want to proceed?</p>
            <div className="popup-actions">
              <button className="cancel-btn" onClick={() => setShowDonorPopup(false)}>Cancel</button>
              <button className="proceed-btn" onClick={() => window.location.href = "https://donor-management-platform.example.com"}>Proceed</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddIncome;
